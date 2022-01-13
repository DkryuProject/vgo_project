#!/usr/bin/env python
# -*- coding: utf-8, euc-kr -*-

import os
import platform
import calendar
import requests
import re
from time import sleep
from bs4 import BeautifulSoup
from multiprocessing import Process
from exceptions import *
from article_parser import ArticleParser
#from writer_day import WriterDay
import datetime
import pytz
# from konlpy.tag import Kkma, Okt, Komoran
# okt = Okt()
from googletrans import Translator
import pymysql
import warnings
warnings.filterwarnings("ignore")

class ArticleCrawler(object):
    def __init__(self):
        self.categories = {'APN':'CAT100'}
        self.selected_categories = []
        self.date = {'start_year': 0, 'start_month': 0, 'start_day': 0}
        self.user_operating_system = str(platform.system())
        self.data_result = []


    def set_category(self, *args):
        for key in args:
            if self.categories.get(key) is None:
                raise InvalidCategory(key)
        self.selected_categories = args

    def set_date_range(self, start_year, start_month, end_year, end_month):
        args = [start_year, start_month, end_year, end_month]
        if start_year > end_year:
            raise InvalidYear(start_year, end_year)
        if start_month < 1 or start_month > 12:
            raise InvalidMonth(start_month)
        if end_month < 1 or end_month > 12:
            raise  InvalidMonth(end_month)
        if start_year == end_year and start_month > end_month:
            raise OverbalanceMonth(start_month, end_month)
        for key, date in zip(self.date, args):
            self.date[key] = date

    def set_date(self, start_year, start_month, start_day):
        args = [start_year, start_month, start_day]
        if start_month < 1 or start_month > 12:
            raise InvalidMonth(start_month)
        if start_day < 1 or start_day > 31:
            raise  InvalidMonth(start_day)
        for key, date in zip(self.date, args):
            self.date[key] = date

    @staticmethod
    def make_news_page_url(category_url, start_year, end_year, start_month, end_month):
        made_urls = []
        for year in range(start_year, end_year + 1):
            target_start_month = start_month
            target_end_month = end_month

            if start_year != end_year:
                if year == start_year:
                    target_start_month = start_month
                    target_end_month = 12
                elif year == end_year:
                    target_start_month = 1
                    target_end_month = end_month
                else:
                    target_start_month = 1
                    target_end_month = 12

            for month in range(target_start_month, target_end_month + 1):
                for month_day in range(1, calendar.monthrange(year, month)[1] + 1):
                    if len(str(month)) == 1:
                        month = "0" + str(month)
                    if len(str(month_day)) == 1:
                        month_day = "0" + str(month_day)

                    # 날짜별로 Page Url 생성
                    url = category_url + str(year) + str(month) + str(month_day)

                    # totalpage는 네이버 페이지 구조를 이용해서 page = 10000 으로 지정해 totalpage를 알아냄
                    # page = 10000 을 입력할 경우 페이지가 존재하지 않기 때문에 page = totalpage로 이동 됨 (Redirect)
                    totalpage = ArticleParser.find_news_totalpage(url + "&page=10000")
                    for page in range(1, totalpage + 1):
                        made_urls.append(url + "&page=" + str(page))

        return made_urls


    @staticmethod
    def make_new_page_day_url(category_url, start_year, start_month, start_day):
        made_urls = []
        month = start_month
        day = start_day
        if len(str(start_month)) == 1:
            month = "0" + str(start_month)
        if len(str(start_day)) == 1:
            day = "0" + str(start_day)

        url = category_url + str(start_year) + '-' + str(month) + '-' + str(day)

        for page in range(1, 4):
            made_urls.append(url + "&page=" + str(page))

        return made_urls

    @staticmethod
    def make_new_day(start_year, start_month, start_day):
        month = start_month
        day = start_day
        if len(str(start_month)) == 1:
            month = "0" + str(start_month)
        if len(str(start_day)) == 1:
            day = "0" + str(start_day)

        new_day = str(start_year) + "-" + str(month) + "-" + str(day)

        return new_day

    @staticmethod
    def get_url_data(url, max_tries=5):
        remaining_tries = int(max_tries)
        while remaining_tries > 0:
            try:
                return requests.get(url, headers={'User-Agent':'Mozilla/5.0'})
            except requests.exceptions:
                sleep(1)
            remaining_tries = remaining_tries - 1
        raise ResponseTimeout()

    @staticmethod
    def save_data(category_name, create_date, data_dict):

        try:
            conn = pymysql.connect(host='172.31.6.2', user='devmysql', password='VgoDhg0520', db='vgodb', charset='utf8mb4')
            # print('Connection Success!')
            curs = conn.cursor()

            sql = "SELECT COUNT(*) FROM crawling_news WHERE category_name =%s and create_date =%s and headline =%s and country = 'ko';"
            curs.execute(sql, (str(category_name), str(create_date), str(data_dict[0][6])))
            result = curs.fetchone()
            # print('result1 =====> ' + str(data_dict[0][6]))
            if result[0] == 0:
                sql_ko = """INSERT INTO crawling_news (create_date, article_num, country, category_name, outlets, reporter, headline, sentence, image_url, content_url) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"""

                # print(sql_ko)
                # print(data_dict)
                curs.executemany(sql_ko, data_dict)

            conn.commit()

        except pymysql.err.DatabaseError as err:
            print('Database Connection Error ====> ' + err)
        finally:
            conn.close()


    def crawling(self, category_name):
        print(category_name + " PID: " + str(os.getpid()))

        # writer = Writer(category='Article', article_category=category_name, date=self.date)
        # day
        # writer = WriterDay(category='ITN', article_category=category_name, date=self.date)

        # dictionary 로 저장
        translator = Translator()
        data_dict = dict()
        en_data_dict = dict()
        id_data_dict = dict()
        vi_data_dict = dict()

        # 기사 url 형식
        # url_format = f'http://news.naver.com/main/list.nhn?mode=LSD&mid=sec&sid1={self.categories.get(category_name)}&date='
        url_format = f'http://www.appnews.co.kr/news/news_list/?cat={self.categories.get(category_name)}&searchKey=&daily='
        # start_year 년 start_month 월 ~ end_year의 end_month 날짜까지 기사를 수집한다.
        # target_urls = self.make_news_page_url(url_format, self.date['start_year'], self.date['end_year'], self.date['start_month'], self.date['end_month'])

        # 하루단위
        # target_urls = self.make_new_page_day_url(url_format, self.date['start_year'], self.date['start_month'], self.date['start_day'])
        # target_urls = []
        # target_urls.append(url_format)
        target_urls = self.make_new_page_day_url(url_format, self.date['start_year'], self.date['start_month'],
                                                 self.date['start_day'])

        print(category_name + " Urls are generated")
        print("The crawler starts")
        # print("target_urls ==> ",  target_urls)

        article_num = 0

        for url in list(reversed(target_urls)):
            # print(url)
            # print('url =====> ' + url['create_date'].replace('T', ' ')[0:19]);
            # print('url =====> ' + datetime.datetime.now());
            # if url['create_date'].replace('T', ' ')[0:19] > datetime.datetime.now():
            #     # continue
            #     print('---------')

            request = self.get_url_data(url)
            document = BeautifulSoup(request.content, 'html.parser')
            # print('document ==> ', document)
            # break

            # html - newsflash_body - type06_headline, type06
            # 각 페이지에 있는 기사들 가져오기
            # temp_post = document.select('.newsflash_body .type06_headline li dl')
            # temp_post.extend(document.select('.newsflash_body .type06 li dl'))
            temp_post = document.select('#sub_list > ul > li')
            # print('temp_post ====> ' + str(temp_post))

            post_urls = []
            outlets_status = []
            for line in list(reversed(temp_post)):
                # print('line ====> ' + str(line))
                url_temp = ''
                url_temp = line.a.get('href') if str(line.a.get('href')).startswith('http') else f'http://www.appnews.co.kr' + str(line.a.get('href'))
                # print('url_temp ====>\n' + url_temp)

                def check_date():
                    value = bool(line.find('dd', {'class':'info'}))
                    if value:
                        return line.find('dd', {'class': 'info'}).text
                    return None

                temp_date = check_date()

                if not temp_date:
                    continue

                # temp_outlets = str(temp_date).split('ㅣ')[0]
                # temp_date = str(temp_date).split('ㅣ')[1].replace("/", "-")
                # temp_date = datetime.datetime.strptime(temp_date + " 00:00:00", '%Y-%m-%d %H:%M:%S')
                # imsi_date = str(str(self.date['start_year']) + "-" + str(self.date['start_month']) + "-" + str(self.date['start_day']) + " 00:00:00")
                # imsi_date = datetime.datetime.strptime(imsi_date, '%Y-%m-%d %H:%M:%S')

                temp_outlets = str(temp_date).split('ㅣ')[0]
                temp_date = str(temp_date).split('ㅣ')[1].replace("/", "-")
                temp_date = datetime.datetime.strptime(temp_date, '%Y-%m-%d')
                imsi_date = str(str(self.date['start_year']) + "-" + str(self.date['start_month']) + "-" + str(self.date['start_day']))
                imsi_date = datetime.datetime.strptime(imsi_date, '%Y-%m-%d')
#                print(str(imsi_date) + " - " + str(temp_date))

                # 페이지 수만큼 가져올려면 이곳을 주석 처리한다.
#                if imsi_date > temp_date:
#                    continue

                post_urls.append(url_temp)
                outlets_status.append(temp_outlets)
                # print("post_urls\n", post_urls)

                # print('Line ======> ' + str(line.find('em', {'class':'info dated'}).text))

            del temp_post
            # print("post_urls\n", post_urls)


            for content_url, temp_outlets in zip(post_urls, outlets_status):   # 기사 url
                # print('content_url =====> ' + content_url)
                # 크롤링 대기 시간
                sleep(0.01)

                # 기사 HTML 가져옴
                request_content = self.get_url_data(content_url)

                # print('request_content ====> ' + str(request_content))

                try:
                    document_content = BeautifulSoup(request_content.content, 'html.parser')
                except:
                    continue

                self.data_result = []
                try:
                    # 기사 시간대 가져옴
                    # time = re.findall('<span class="t11">(.*)</span>', request_content.text)[0]
                    time = document_content.select_one('#contents_view > div.news_title > div > p.date').text
                    # print('time ====> ' + str(time))
                    # 기사 시간 초기화
                    text_time = ''
                    text_time = text_time + str(time).replace('발행 ', '').replace('년', '-').replace('월', '-').replace('일',' ').replace(' ', '') + " 00:00:00"
                    # print('text_time ====> ' + str(text_time))
                    # 공백일 경우 시간 제외 처리
                    if not text_time:
                        continue

                    # 기사 제목 가져옴
                    tag_headline = document_content.find_all('meta', {'property':'og:title'})
                    # print('tag_headline ====> ', str(tag_headline))
                    # 뉴스 기사 제목 초기화
                    text_headline = ''
                    text_headline = text_headline + str(tag_headline[0].get('content'))
                    # print('text_headline ====> ', str(text_headline))
                    # 공백일 경우 기사 제외 처리
                    if not text_headline:
                        continue

                    # 기사 본문 가져옴
                    tag_content = document_content.select('#contents_view > div.news_con')
                    # print('tag_content ====> ' + str(tag_content))
                    # print('tag_content2 ====> ' + str(tag_content[2].text))

                    # 뉴스 기사 본문 초기화
                    text_sentence = ''
                    text_sentence = text_sentence + ArticleParser.clear_content(str(tag_content[0].find_all(text=True)))
                    tag_start = str(text_sentence).find('[어패럴뉴스')
                    tag_end = str(text_sentence).find(' 기자 ')
                    # print('text_sentence ====> ' + text_sentence)
                    text_sentence = str(text_sentence[tag_end + 4:])
                    # print('text_sentence1 ====> ' + text_sentence)
                    # 공백 일 경우 기사 제외 처리
                    if not text_sentence:
                        continue

                    # 이미지 url 가져옴
                    # tag_image = document_content.select_one('#articleBodyContents > span.end_photo_org > img')['src']
                    tag_image = document_content.find_all('meta', {'property':'og:image'})

                    # 이미지 초기화
                    image_url = ''
                    image_url = image_url + str(tag_image[0].get('content'))
                    image_url = image_url.split('?')[0]
                    # print('temp_outlets ====> ' + temp_outlets)

                    # if not image_url:
                    #     continue

                    tag_reporter = document_content.select_one('#contents_view > div.news_title > div > p.writer').text
                    # print('tag_reporter =====> ' + tag_reporter)

                    text_reporter = ''
                    text_reporter = text_reporter + str(tag_reporter)

                    # 기사 언론사 가져옴
                    tag_company = temp_outlets

                    # 언론사 초기화
                    text_company = ''
                    text_company = text_company + str(tag_company)
                    # print('text_company =====> ' + text_company)

                    # 공백일 경우 기사 제외 처리
                    if not text_company:
                        continue

                    article_num += 1

                    # dict 에 저장
                    data_dict['create_date'] = text_time
                    data_dict['article_num'] = str(article_num)
                    data_dict['country'] = 'ko'
                    data_dict['category_name'] = str(category_name)
                    data_dict['outlets'] = text_company
                    data_dict['reporter'] = text_reporter
                    data_dict['headline'] = text_headline
                    data_dict['sentence'] = text_sentence
                    data_dict['image_url'] = image_url
                    data_dict['content_url'] = content_url
                    # print('data_dict ====> ' + str(data_dict))
                    sleep(0.01)
                    id_data_dict['create_date'] = str(data_dict['create_date'])
                    id_data_dict['article_num'] = str(data_dict['article_num'])
                    id_data_dict['country'] = 'id'
                    id_data_dict['category_name'] = str(data_dict['category_name'])
                    id_data_dict['outlets'] = translator.translate(str(data_dict['outlets']), src='ko', dest='id').text
                    id_data_dict['reporter'] = translator.translate(str(data_dict['reporter']), src='ko', dest='id').text
                    id_data_dict['headline'] = translator.translate(str(data_dict['headline']), src='ko', dest='id').text
                    id_data_dict['sentence'] = translator.translate(str(data_dict['sentence']), src='ko', dest='id').text
                    id_data_dict['image_url'] = str(data_dict['image_url'])
                    id_data_dict['content_url'] = str(data_dict['content_url'])
                    # print('in_data_dict ====> ' + str(id_data_dict))
                    sleep(0.01)
                    vi_data_dict['create_date'] = str(data_dict['create_date'])
                    vi_data_dict['article_num'] = str(data_dict['article_num'])
                    vi_data_dict['country'] = 'vi'
                    vi_data_dict['category_name'] = str(data_dict['category_name'])
                    vi_data_dict['outlets'] = translator.translate(str(data_dict['outlets']), src='ko', dest='vi').text
                    vi_data_dict['reporter'] = translator.translate(str(data_dict['reporter']), src='ko', dest='vi').text
                    vi_data_dict['headline'] = translator.translate(str(data_dict['headline']), src='ko', dest='vi').text
                    vi_data_dict['sentence'] = translator.translate(str(data_dict['sentence']), src='ko', dest='vi').text
                    vi_data_dict['image_url'] = str(data_dict['image_url'])
                    vi_data_dict['content_url'] = str(data_dict['content_url'])
                    # print('vi_data_dict ====> ' + str(vi_data_dict))
                    sleep(0.01)
                    en_data_dict['create_date'] = str(data_dict['create_date'])
                    en_data_dict['article_num'] = str(data_dict['article_num'])
                    en_data_dict['country'] = 'en'
                    en_data_dict['category_name'] = str(data_dict['category_name'])
                    en_data_dict['outlets'] = translator.translate(str(data_dict['outlets']), src='ko', dest='en').text
                    en_data_dict['reporter'] = translator.translate(str(data_dict['reporter']), src='ko', dest='en').text
                    en_data_dict['headline'] = translator.translate(str(data_dict['headline']), src='ko', dest='en').text
                    en_data_dict['sentence'] = translator.translate(str(data_dict['sentence']), src='ko', dest='en').text
                    en_data_dict['image_url'] = str(data_dict['image_url'])
                    en_data_dict['content_url'] = str(data_dict['content_url'])
                    # print('en_data_dict ====> ' + str(en_data_dict))

                    # print('data_dict ====> \n' + str(data_dict))
                    # sleep(1.0)
                    # self.save_data(data_dict)
                    # print(data_dict.values())
                    self.data_result.append(tuple(data_dict.values()))
                    self.data_result.append(tuple(vi_data_dict.values()))
                    self.data_result.append(tuple(en_data_dict.values()))
                    self.data_result.append(tuple(id_data_dict.values()))
                    print(str(data_dict))
                    # self.save_data(str(data_dict['category_name']), str(data_dict['create_date']), self.data_result)

                    # CSV 작성
                    # writer.write_row([text_time, str(article_num), 'ko', str(category_name), text_company, text_company, text_headline, text_sentence, image_url, content_url])
                    # writer.write_row([en_data_dict['create_date'], en_data_dict['article_num'], 'en', en_data_dict['category_name'], en_data_dict['outlets'], en_data_dict['reporter'], en_data_dict['headline'], en_data_dict['sentence'], en_data_dict['image_url'], en_data_dict['content_url']])
                    # writer.write_row(
                    #     [vi_data_dict['create_date'], vi_data_dict['article_num'], 'vi', vi_data_dict['category_name'],
                    #      vi_data_dict['outlets'], vi_data_dict['reporter'], vi_data_dict['headline'],
                    #      vi_data_dict['sentence'], vi_data_dict['image_url'], vi_data_dict['content_url']])
                    # writer.write_row(
                    #     [id_data_dict['create_date'], id_data_dict['article_num'], 'id', id_data_dict['category_name'],
                    #      id_data_dict['outlets'], id_data_dict['reporter'], id_data_dict['headline'],
                    #      id_data_dict['sentence'], id_data_dict['image_url'], id_data_dict['content_url']])

                    del time
                    del text_company, text_sentence, text_headline
                    del tag_company
                    del tag_content, tag_headline #, tag_image
                    del request_content, document_content

                # UnicodeEncodeError
                except Exception as ex:
                    del request_content, document_content
                    pass

        # writer.close()
        # post_urls.clear()
        print("The crawler end.")



    def start(self):
        # MultiProcess 크롤링 시작
        for category_name in self.selected_categories:
            proc = Process(target=self.crawling, args=(category_name, ))
            proc.start()


if __name__ == "__main__":
    Crawler = ArticleCrawler()
    Crawler.set_category('APN')
    # Crawler.set_date_range(2021, 8, 2021, 8)
    # Crawler.set_date(2021, 9, 3)
    KST = pytz.timezone('Asia/Seoul')
    today = datetime.datetime.now(KST)
    # print('today ====> '  + str(today.year) + "-" + str(today.month) + "-" + str(today.day))
    Crawler.set_date(today.year, today.month, today.day)
    Crawler.start()

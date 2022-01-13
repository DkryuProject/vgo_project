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
#from konlpy.tag import Kkma, Okt, Komoran
#okt = Okt()
#from konlpy.utils import pprint
# from sklearn.feature_extraction.text import TfidfVectorizer
# import pandas as pd
import pymysql
import re
from googletrans import Translator

import warnings
warnings.filterwarnings("ignore")

class ArticleCrawler(object):
    def __init__(self):
        self.categories = {'Fashionbiz':'1'}
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
        # print(self.date)

    def set_date(self, start_year, start_month, start_day):
        args = [start_year, start_month, start_day]
        if start_month < 1 or start_month > 12:
            raise InvalidMonth(start_month)
        if start_day < 1 or start_day > 31:
            raise  InvalidMonth(start_day)
        for key, date in zip(self.date, args):
            self.date[key] = date
        # print(self.date)

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
        # print('url ====> ' + url)

        made_urls.append(url)

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
    def remove_tag(content):
        cleanr = re.compile('<.*?>]')
        cleantext = re.sub(cleanr, '', content)
        return cleantext

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
        # print(data_dict)
        # data_result = []
        try:
            conn = pymysql.connect(host='172.31.6.2', user='devmysql', password='VgoDhg0520', db='vgodb', charset='utf8mb4')
            # print('Connection Success!')
            curs = conn.cursor()

            # print(data_dict)
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

        # day
        # writer = WriterDay(category='ITN', article_category=category_name, date=self.date)

        translator = Translator()
        data_dict = dict()
        en_data_dict = dict()
        id_data_dict = dict()
        vi_data_dict = dict()

        # 기사 url 형식
        url_format = f'https://www.fashionbiz.co.kr/article/list.asp?daily='
        # start_year 년 start_month 월 ~ end_year의 end_month 날짜까지 기사를 수집한다.
        # target_urls = self.make_news_page_url(url_format, self.date['start_year'], self.date['end_year'], self.date['start_month'], self.date['end_month'])

        # 하루단위
        target_urls = self.make_new_page_day_url(url_format, self.date['start_year'], self.date['start_month'], self.date['start_day'])
        # target_urls = []
        # target_urls.append(target_urls)

        print(category_name + " Urls are generated")
        print("The crawler starts")
        # print("target_urls ==> ",  target_urls)

        article_num = 0

        for url in list(reversed(target_urls)):
            request = self.get_url_data(url)
            document = BeautifulSoup(request.content, 'html.parser')

            temp_post = document.find_all('div', {'class': 'list'})
            # print('temp_post ====> ' + str(temp_post))

            # 각 페이지에 있는 기사들의 url 저장
            post_urls = []
            line_image_url = []
            for line in temp_post:
                # 해당되는 page에서 모든 기사들의 URL을 post_urls 리스트에 넣음
                # post_urls.append(line.a.get('href'))

                line_href = line.find("p", {'class': 'txt01'}).find("a")["href"]
                line_image = line.find('span', {'class': 'com_img'})
                line_image_url.append(str(line_image.find("img")['src']) if line_image is not None else '')

                url_temp = ''
                url_temp = line_href if str(line_href).startswith('http') else f'https://www.fashionbiz.co.kr' + str(
                    line_href)
                # print('url_temp ====> ' + url_temp)

                # print('line =====> ' + str(line))
                temp_date = str(line.find('div', {'class': 'hits'}).find('li').text).replace('/', '-')
                #temp_now = datetime.datetime.now()
                temp_date = datetime.datetime.strptime(temp_date, '%Y-%m-%d')

                imsi_date = str(str(self.date['start_year']) + "-" + str(self.date['start_month']) + "-" + str(
                    self.date['start_day']))
                imsi_date = datetime.datetime.strptime(imsi_date, '%Y-%m-%d')
                # print('temp_date ====> ' + str(imsi_date) + " - " + str(temp_date))

                # 페이지 수만큼 가져올려면 이곳을 주석 처리한다.
                if imsi_date > temp_date:
                    continue

                post_urls.append(url_temp)

            del temp_post
            # print("post_urls\n", post_urls)
            # print("line_image_url\n", line_image_url)

            for content_url, line_image in zip(list(post_urls), list(line_image_url)):  # 기사 url
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
                    # 현재 시간에서 배치 시간 차이의 시간을 찾아가져오자
                    now = datetime.datetime.now()
                    current_time = now.strftime('%H:%M:%S')

                    current_day = self.make_new_day(self.date['start_year'], self.date['start_month'],
                                                    self.date['start_day'])

                    # current_day = current_day + " " + current_time
                    current_day = current_day + " " + "00:00:00"
                    # 기사 시간 초기화
                    text_time = ''
                    # text_time = text_time + str(time[0].get('content'))
                    text_time = text_time + str(current_day)
                    # print('날짜~~~~~~ ' + text_time)
                    # 공백일 경우 시간 제외 처리
                    if not text_time:
                        continue

                    # 기사 제목 가져옴
                    # tag_headline = document_content.find_all('h3', {'id': 'articleTitle'}, {'class': 'tts_head'})
                    tag_headline = document_content.find_all('h3', {'class': 'tit03'})
                    # print('tag_headline ====> ', str(tag_headline))
                    # 뉴스 기사 제목 초기화
                    text_headline = ''
                    text_headline = text_headline + ArticleParser.clear_headline(
                        str(tag_headline[0].find_all(text=True)))
                    # print('text_headline ====> ', str(text_headline))
                    # 공백일 경우 기사 제외 처리
                    if not text_headline:
                        continue

                    # 기사 본문 가져옴
                    # tag_content = document_content.find_all('div', {'id': 'articleBodyContents'})
                    # tag_content = document_content.find_all('article', {'id':'article-view_content-div'}, {'class':'article-veiw-body'})
                    tag_content = document_content.select('.view_cont')
                    # print('tag_content ====> ' + str(tag_content))
                    # 뉴스 기사 본문 초기화
                    text_sentence = ''
                    text_sentence = text_sentence + ArticleParser.clear_content(str(tag_content[0].find_all(text=True)))
                    # print('text_sentence ====> ' + text_sentence)
                    # print('text_sentence ====> ' + translator.translate(text_sentence, src='ko', dest='en').text)
                    # 공백 일 경우 기사 제외 처리
                    if not text_sentence:
                        continue

                    # 이미지 url 가져옴
                    tag_image = line_image
                    # print('tag_image ====> ' + str(tag_image))
                    # 이미지 초기화
                    image_url = ''
                    image_url = tag_image if str(tag_image).startswith(
                        'http') else f'https://www.fashionbiz.co.kr' + str(tag_image) if str(tag_image) != "" else ''
                    image_url = image_url.split('?')[0]
                    # print('image_url ====> ' + image_url)

                    # if not image_url:
                    #     continue

                    # 기사 리포터 가져옴
                    tag_reporter = []
                    tag_reporter = str(document_content.find_all('p', {'class': 'txt02'}))
                    tag_reporter = self.remove_tag(tag_reporter.split('|')[1])
                    # print('tag_reporter ======> ' + tag_reporter)

                    # tag_reporter = document_content.find_all('meta', {'name': 'apple-mobile-web-app-title'})

                    # 리포터 초기화
                    text_reporter = ''
                    text_reporter = text_reporter + str(tag_reporter)
                    # text_reporter = text_reporter + str(text_reporter[0].get('content'))
                    # print('text_reporter =====> ' + text_reporter)

                    # 기사 언론사 가져옴
                    tag_company = []
                    # tag_company = str(document_content.find_all('p', {'class': 'txt02'}))
                    tag_company = document_content.find('div', {'class': 'txt_box'}).find('span').text
                    # tag_company = self.remove_tag(tag_company)
                    # print('tag_company ======> ' + tag_company)
                    # print('tag_company ======> ' + translator.translate(tag_company).text)

                    # tag_company = document_content.find_all('meta', {'name': 'apple-mobile-web-app-title'})

                    # 언론사 초기화
                    text_company = ''
                    text_company = text_company + str(tag_company)
                    # text_company = text_company + str(tag_company[0].get('content'))
                    # print('text_company =====> ' + text_company)
                    # print('text_company =====> ' + translator.translate(text_company).text)

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
                    # print(data_result)
                    self.save_data(str(data_dict['category_name']), str(data_dict['create_date']), self.data_result)
                    # self.save_data(data_dict, vi_data_dict, en_data_dict, id_data_dict)

                    # CSV 작성
                    # writer.write_row([text_time, str(article_num), 'ko', str(category_name), text_company, text_reporter, text_headline, text_sentence, image_url, content_url])
                    # writer.write_row([en_data_dict['create_date'], en_data_dict['article_num'], 'en', en_data_dict['category_name'], en_data_dict['outlets'], en_data_dict['reporter'], en_data_dict['headline'], en_data_dict['sentence'], en_data_dict['image_url'], en_data_dict['content_url']])
                    # writer.write_row(
                    #     [vi_data_dict['create_date'], vi_data_dict['article_num'], 'vi', vi_data_dict['category_name'],
                    #      vi_data_dict['outlets'], vi_data_dict['reporter'], vi_data_dict['headline'],
                    #      vi_data_dict['sentence'], vi_data_dict['image_url'], vi_data_dict['content_url']])
                    # writer.write_row(
                    #     [id_data_dict['create_date'], id_data_dict['article_num'], 'id', id_data_dict['category_name'],
                    #      id_data_dict['outlets'], id_data_dict['reporter'], id_data_dict['headline'],
                    #      id_data_dict['sentence'], id_data_dict['image_url'], id_data_dict['content_url']])

                    # del time
                    del text_company, text_sentence, text_headline
                    del tag_company, tag_reporter
                    del tag_content, tag_headline, line_image
                    del request_content, document_content


                # UnicodeEncodeError
                except Exception as ex:
                    del request_content, document_content
                    pass

        # writer.close()

        print("The crawler end.")

    def start(self):
        # MultiProcess 크롤링 시작
        for category_name in self.selected_categories:
            proc = Process(target=self.crawling, args=(category_name,))
            proc.start()

if __name__ == "__main__":
    Crawler = ArticleCrawler()
    Crawler.set_category('Fashionbiz')
    # Crawler.set_date_range(2021, 8, 2021, 8)
    # Crawler.set_date(2021, 9, 9)
    KST = pytz.timezone('Asia/Seoul')
    today = datetime.datetime.now(KST)
    Crawler.set_date(today.year, today.month, today.day)
    Crawler.start()



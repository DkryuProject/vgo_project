#!/usr/bin/env python
# -*- coding: utf-8, euc-kr -*-

import platform
import calendar
import requests
from time import sleep
from bs4 import BeautifulSoup
from multiprocessing import Process
from exceptions import *
from article_parser import ArticleParser
import datetime
import pytz
import pymysql
import re
from googletrans import Translator
#from writer_day import WriterDay
import warnings
warnings.filterwarnings("ignore")


class ArticleCrawler(object):
    def __init__(self):
        self.categories = {'ktnews':'S1N7'}
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

                    # ???????????? Page Url ??????
                    url = category_url + str(year) + str(month) + str(month_day)

                    # totalpage??? ????????? ????????? ????????? ???????????? page = 10000 ?????? ????????? totalpage??? ?????????
                    # page = 10000 ??? ????????? ?????? ???????????? ???????????? ?????? ????????? page = totalpage??? ?????? ??? (Redirect)
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

        # totalpage = ArticleParser.find_news_totalpage(url + "&page=3")
        # for page in range(1, totalpage + 1):
        for page in range(1, 4):
            made_urls.append(url + "&page=" + str(page))
        # made_urls.append(url)

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
            #print('result1 =====> ' + str(data_dict[0][6]))
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

        # writer = WriterDay(category='ktnews', article_category=category_name, date=self.date)

        # dictionary ??? ??????
        translator = Translator()
        data_dict = dict()
        en_data_dict = dict()
        id_data_dict = dict()
        vi_data_dict = dict()


        # ?????? url ??????
        url_format = f'https://www.ktnews.com/news/articleList.html?sc_section_code={self.categories.get(category_name)}&view_type=sm&daily='
        # print(url_format)

        # ????????????
        target_urls = self.make_new_page_day_url(url_format, self.date['start_year'], self.date['start_month'],
                                                 self.date['start_day'])

        # target_urls = []
        # target_urls.append(target_urls)

        print(category_name + " Urls are generated")
        print("The crawler starts")
        # print("target_urls ==> ",  target_urls)

        article_num = 0

        for url in list(reversed(target_urls)):
            # print('url ====> ' + str(url))
            request = self.get_url_data(url)
            document = BeautifulSoup(request.content, 'html.parser')
            # print('document ====> ' + str(document))
            # temp_post = document.find('div', {'class':'article-list'}).find('div', {'class':'list-block'})
            temp_post = document.select('div.article-list > section > div')
            # temp_post = document.select('#section > div > div')
            # temp_post = document.find('section', {'class':'article-list-content'}).findAll('div', {'class':'list-block'})
            # print('temp_post ====> ' + str(temp_post))

            # ??? ???????????? ?????? ???????????? url ??????
            post_urls = []
            reporter_text = []
            for line in list(reversed(temp_post)):
                # ???????????? page?????? ?????? ???????????? URL??? post_urls ???????????? ??????
                # post_urls.append(line.a.get('href'))
                # print('line =====> ' + str(line))

                url_temp = ''
                url_temp = line.a.get('href') if str(line.a.get('href')).startswith(
                    'http') else f'https://www.ktnews.com' + str(line.a.get('href'))
                # print('url_temp ====> ' + url_temp)

                # print('line =====> ' + str(line))
                temp_date = line.find('div', {'class':'list-dated'}).text

                temp_reporter = str(temp_date).split('| ')[1]
                temp_date = str(temp_date).split('| ')[2] + ":00"

                #KST = pytz.timezone('Asia/Seoul')
                #temp_now = datetime.datetime.now(KST)
                #temp_now_hour = str(temp_now.hour) if len(str(temp_now.hour)) == 2 else "0" + str(temp_now.hour)
                #temp_now_minute = str(temp_now.minute) if len(str(temp_now.minute)) == 2 else "0" + str(temp_now.minute)
                #temp_now_second = str(temp_now.second) if len(str(temp_now.second)) == 2 else "0" + str(temp_now.second)
                #temp_now = str(temp_now_hour + ":" + temp_now_minute + ":" + temp_now_second)
                #temp_now = datetime.datetime.strptime(
                #    str(str(self.date['start_year']) + "-" + str(self.date['start_month']) + "-" + str(
                #        self.date['start_day']) + " " + temp_now), '%Y-%m-%d %H:%M:%S')
                temp_now = datetime.datetime.strptime(
                    str(self.date['start_year']) + "-" + str(self.date['start_month']) + "-" + str(
                        self.date['start_day']), '%Y-%m-%d')
                temp_date = datetime.datetime.strptime(temp_date, '%Y-%m-%d %H:%M:%S')

                # imsi_date = str(str(self.date['start_year']) + "-" + str(self.date['start_month']) + "-" + str(self.date['start_day']))
                # imsi_date = datetime.datetime.strptime(imsi_date, '%Y-%m-%d')
                #print('temp_date ====> ' + str(temp_now) + " > " + str(temp_date))

                # ????????? ????????? ??????????????? ????????? ?????? ????????????.
                if temp_now > temp_date:
                    continue

                post_urls.append(url_temp)
                reporter_text.append(temp_reporter)


            del temp_post
            # print("post_urls\n", post_urls)
            # print("reporter_text\n", reporter_text)


            for content_url, reporter in zip(post_urls, reporter_text):   # ?????? url
                # ????????? ?????? ??????
                sleep(0.01)

                # ?????? HTML ?????????
                request_content = self.get_url_data(content_url)

                # print('request_content ====> ' + str(request_content))

                try:
                    document_content = BeautifulSoup(request_content.content, 'html.parser')
                except:
                    continue

                self.data_result = []
                try:
                    # ?????? ???????????? ?????? ?????? ????????? ????????? ??????????????????
                    # ?????? ?????? ?????????
                    time = document_content.find_all('meta', {'property': 'article:published_time'})
                    text_time = ''
                    text_time = text_time + str(time[0].get('content')).replace('T', ' ')[0:19]

                    # ????????? ?????? ?????? ?????? ??????
                    if not text_time:
                        continue

                    # ?????? ?????? ?????????
                    tag_headline = document_content.find_all('meta', {'name':'title'})

                    # ?????? ?????? ?????? ?????????
                    text_headline = ''
                    text_headline = text_headline + str(tag_headline[0].get('content'))
                    # print('text_headline ====> ', str(text_headline))
                    # ????????? ?????? ?????? ?????? ??????
                    if not text_headline:
                        continue

                    # ?????? ?????? ?????????
                    tag_content = document_content.find_all('meta', {'name':'description'})
                    # ?????? ?????? ?????? ?????????
                    text_sentence = ''
                    text_sentence = text_sentence + str(tag_content[0].get('content'))
                    # print('text_sentence ====> ', str(text_sentence))
                    # ?????? ??? ?????? ?????? ?????? ??????
                    if not text_sentence:
                        continue

                    # ????????? url ?????????
                    tag_image = document_content.find_all('meta', {'property':'og:image'})

                    # ????????? ?????????
                    image_url = ''
                    image_url = image_url + str(tag_image[0].get('content'))
                    image_url = image_url.split('?')[0]
                    # print('image_url ====> ', str(image_url))
                    # if not image_url:
                    #     continue

                    # ?????? ????????? ?????????
                    # tag_reporter = []
                    # tag_reporter = document_content.find_all('meta', {'property':'og:article:author'})

                    # ????????? ?????????
                    text_reporter = ''
                    # text_reporter = text_reporter + str(tag_reporter[0].get('content'))
                    text_reporter = text_reporter + reporter
                    # print('text_reporter =====> ' + text_reporter)


                    # ?????? ????????? ?????????
                    tag_company = document_content.find_all('meta', {'property':'article:section'})

                    # ????????? ?????????
                    text_company = ''
                    text_company = text_company + str(tag_company[0].get('content'))
                    # print('text_company =====> ' + text_company)
                    # ????????? ?????? ?????? ?????? ??????
                    if not text_company:
                        continue

                    article_num += 1

                    # dict ??? ??????
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
                    #print('data_dict ====> ' + str(data_dict))

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
                    #print('en_data_dict ====> ' + str(en_data_dict))

                    # print('data_dict ====> \n' + str(data_dict))
                    # sleep(1.0)
                    # self.save_data(data_dict)
                    # print(data_dict.values())
                    self.data_result.append(tuple(data_dict.values()))
                    self.data_result.append(tuple(vi_data_dict.values()))
                    self.data_result.append(tuple(en_data_dict.values()))
                    self.data_result.append(tuple(id_data_dict.values()))
                    # print(self.data_result)
                    self.save_data(str(data_dict['category_name']), str(data_dict['create_date']), self.data_result)
                    # self.save_data(data_dict, vi_data_dict, en_data_dict, id_data_dict)

                    # CSV ??????
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
                    del tag_company
                    del tag_content, tag_headline
                    del request_content, document_content


                # UnicodeEncodeError
                except Exception as ex:
                    del request_content, document_content
                    pass

        # writer.close()

        print("The crawler end.")



    def start(self):
        # MultiProcess ????????? ??????
        for category_name in self.selected_categories:
            proc = Process(target=self.crawling, args=(category_name, ))
            proc.start()


if __name__ == "__main__":
    Crawler = ArticleCrawler()
    Crawler.set_category('ktnews')
    # Crawler.set_date_range(2021, 8, 2021, 8)
    # Crawler.set_date(2021, 9, 3)
    KST = pytz.timezone('Asia/Seoul')
    today = datetime.datetime.now(KST)
    Crawler.set_date(today.year, today.month, today.day)
    Crawler.start()



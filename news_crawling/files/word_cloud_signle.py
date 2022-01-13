
#!/usr/bin/env python
# -*- coding: utf-8, euc-kr -*-
import os
import pymysql
import datetime
from wordcloud import WordCloud
from matplotlib import pyplot
from time import sleep
from collections import Counter
from konlpy.tag import Okt
import nltk
nltk.download('averaged_perceptron_tagger')

def wordcloud_from_text(language):
    conn = pymysql.connect(host='172.31.6.2', user='devmysql', password='Devmysql1234!', db='vgodb', charset='utf8mb4')
    # print('Connection Success!')
    curs = conn.cursor()

    tmp_date = datetime.datetime.now()
    # print(str(tmp_date.year) + '-' + str(tmp_date.month) + '-' + str(tmp_date.day))
    # now_date = str(tmp_date.year) + '-' + str(tmp_date.month) + '-' + str(tmp_date.day) + " 00:00:00"
    # last_date = str(tmp_date.year) + '-' + str(tmp_date.month) + '-' + str(tmp_date.day) + " 23:59:59"
    now_date = str(tmp_date.year) + '-' + str(tmp_date.month) + '-' + str(15) + " 00:00:00"
    last_date = str(tmp_date.year) + '-' + str(tmp_date.month) + '-' + str(15) + " 23:59:59"
    # print('date ====> ' + now_date + ', ' + last_date)

    sql = """SELECT concat(headline, sentence) FROM crawling_news WHERE create_date between %s and %s and country = %s;"""
    curs.execute(sql, (str(now_date), str(last_date), str(language)))
    result = curs.fetchall()
    result = str(list(zip(*result)))
    # print('result =====> ' + result)

    if result == "":
        print('word cloud text is None')
        return

    noun_list = []
    if language == "ko":
        noun_list = get_noun_list(result, 0)
    else:
        noun_list = get_noun_list(result, 1)

    if len(noun_list) < 10:
        print('word cloud Too small noun list')
        return

    # print('noun_list ====> ' + str(noun_list) + ', ' + str(type(noun_list)))

    wc = WordCloud(font_path="/Library/Fonts/CookieRun Regular.otf", max_font_size=200, width=1200, height=800, scale=2.0, background_color='#ffffff')

    gen = wc.generate_from_frequencies(dict(noun_list))

    fname = datetime.datetime.now().strftime('%y%m%d_%H%M%S') + '_' + str(language) + '.png'

    pyplot.figure()
    pyplot.imshow(gen, interpolation='bilinear')
    pyplot.axis("off")
    wc.to_file(fname)
    pyplot.close()

    try:
        sql_ko = """INSERT INTO crawling_word (created_at, word_nouns, country) VALUES (%s, %s, %s) ON DUPLICATE KEY UPDATE word_nouns =%s;"""
        curs.execute(sql_ko, (str(tmp_date)[0:10], str(noun_list), str(language), str(noun_list)))
    except pymysql.Error as err:
        print(err);

    conn.commit()

    conn.close()

def get_noun_list(text, method=0):
    if method == 0:
        # kr
        noun = tokenizer_konlpy(text)
    else:
        # en
        noun = tokenizer_nltk(text)

    count = Counter(noun)

    noun_list = count.most_common(100)
    return noun_list


def tokenizer_nltk(text):
# NNP: 단수 고유명사, VB: 동사, VBP: 동사 현재형, TO: to 전치사, NN: 명사(단수형 혹은 집합형), DT: 관형사
    is_noun = lambda pos : (pos[:2] == 'NN' or pos[:2] == 'NNP')
    tokenized = nltk.word_tokenize(text)
    return [word for (word, pos) in nltk.pos_tag(tokenized) if is_noun(pos) and len(word) > 1]
#-------------------------------------------------------------------------------------------------------------------
def tokenizer_konlpy(text):
    okt = Okt()
    return [word for word in okt.nouns(text) if len(word) >1]


if __name__ == '__main__':
    wordcloud_from_text('ko')
    # sleep(60)
    wordcloud_from_text('en')

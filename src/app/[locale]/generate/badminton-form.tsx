'use client';

import React, { useState } from 'react';
import Card from 'components/Card/Card';
import { usePlausible } from 'next-plausible';
import { useTranslations } from 'next-intl';

export default function BadmintonForm() {
  const t = useTranslations('All');
  const plausible = usePlausible();

  const [form, setForm] = useState({
    includeOpen: true,
    minCategory: '1000',
    includeChampionship: true,
    includeFinals: true,
    includeOlympics: true,
    includeAsianGames: true,
    onlyMajor: false,
    includeGroup: true,
    includeSemifinal: true,
    includeFinal: true,
    alarmMinutes: 30,
    submitted: false,
  });

  const [urls, setUrls] = useState({
    webcalURL: '',
    googleURL: '',
    downloadURL: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (form.includeOpen) params.set('o', '1');
    else params.set('o', '0');
    params.set('lc', form.minCategory);
    params.set('c', form.includeChampionship ? '1' : '0');
    params.set('f', form.includeFinals ? '1' : '0');
    params.set('y', form.includeOlympics ? '1' : '0');
    params.set('g', form.includeAsianGames ? '1' : '0');
    params.set('m', form.onlyMajor ? '1' : '0');
    params.set('sg', form.includeGroup ? '1' : '0');
    params.set('ss', form.includeSemifinal ? '1' : '0');
    params.set('sf', form.includeFinal ? '1' : '0');
    params.set('a', form.alarmMinutes.toString());
    params.set('lang', 'zh');

    const baseURL = '/api/badminton-calendar';

    setUrls({
      webcalURL: `webcal://badminton-calendar.com${baseURL}?${params.toString()}`,
      googleURL: `https://badminton-calendar.com${baseURL}?${params.toString()}`,
      downloadURL: `${baseURL}?${params.toString()}`,
    });

    setForm({ ...form, submitted: true });

    plausible('Generated Badminton Calendar', {
      props: form,
    });
  };

  return (
    <>
      {!form.submitted ? (
        <Card>
          <h3 className="text-xl mb-4">生成羽毛球比赛日历</h3>

          <form onSubmit={handleSubmit}>
            <fieldset className="mb-6">
              <legend className="font-semibold mb-3 block">包含赛事类型</legend>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.includeOpen}
                    onChange={(e) =>
                      setForm({ ...form, includeOpen: e.target.checked })
                    }
                    className="mr-2"
                  />
                  公开赛
                </label>

                {form.includeOpen && (
                  <div className="ml-6">
                    <label className="block text-sm mb-2">最低等级</label>
                    <select
                      value={form.minCategory}
                      onChange={(e) =>
                        setForm({ ...form, minCategory: e.target.value })
                      }
                      className="w-full p-2 border border-themed rounded bg-input text-primary focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="1000">1000分（超级1000赛）</option>
                      <option value="750">750分（超级750赛）</option>
                      <option value="500">500分（超级500赛）</option>
                      <option value="300">300分（超级300赛）</option>
                      <option value="100">100分（超级100赛）</option>
                      <option value="all">全部等级</option>
                    </select>
                  </div>
                )}

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.includeChampionship}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        includeChampionship: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  锦标赛（世锦赛、洲际锦标赛等）
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.includeFinals}
                    onChange={(e) =>
                      setForm({ ...form, includeFinals: e.target.checked })
                    }
                    className="mr-2"
                  />
                  总决赛
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.includeOlympics}
                    onChange={(e) =>
                      setForm({ ...form, includeOlympics: e.target.checked })
                    }
                    className="mr-2"
                  />
                  奥运会
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.includeAsianGames}
                    onChange={(e) =>
                      setForm({ ...form, includeAsianGames: e.target.checked })
                    }
                    className="mr-2"
                  />
                  亚运会
                </label>
              </div>
            </fieldset>

            <fieldset className="mb-6">
              <legend className="font-semibold mb-3 block">
                包含比赛日类型
              </legend>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.includeGroup}
                    onChange={(e) =>
                      setForm({ ...form, includeGroup: e.target.checked })
                    }
                    className="mr-2"
                  />
                  小组赛
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.includeSemifinal}
                    onChange={(e) =>
                      setForm({ ...form, includeSemifinal: e.target.checked })
                    }
                    className="mr-2"
                  />
                  半决赛
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.includeFinal}
                    onChange={(e) =>
                      setForm({ ...form, includeFinal: e.target.checked })
                    }
                    className="mr-2"
                  />
                  决赛
                </label>
              </div>
            </fieldset>

            <fieldset className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={form.onlyMajor}
                  onChange={(e) =>
                    setForm({ ...form, onlyMajor: e.target.checked })
                  }
                  className="mr-2"
                />
                <span>
                  只显示重点比赛
                  <small className="block text-muted">
                    {t('form.onlyMajorHint')}
                  </small>
                </span>
              </label>
            </fieldset>

            <fieldset className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={form.alarmMinutes > 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      alarmMinutes: e.target.checked ? 30 : 0,
                    })
                  }
                  className="mr-2"
                />
                比赛前提醒
                <select
                  value={form.alarmMinutes}
                  onChange={(e) =>
                    setForm({ ...form, alarmMinutes: parseInt(e.target.value) })
                  }
                  disabled={form.alarmMinutes === 0}
                  className="ml-2 p-2 border border-themed rounded bg-input text-primary focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="30">30分钟</option>
                  <option value="60">60分钟</option>
                  <option value="90">90分钟</option>
                  <option value="120">120分钟</option>
                </select>
              </label>
            </fieldset>

            <button type="submit" className="btn">
              生成日历
            </button>
          </form>
        </Card>
      ) : (
        <>
          <h3 className="text-xl mb-4">下载日历</h3>

          <Card className="mb-6">
            <h4 className="uppercase mb-4">WebCal 订阅</h4>
            <p className="mb-4">
              订阅后，当比赛时间或赛程更新时，你的日历会自动同步更新。
            </p>
            <a href={urls.webcalURL} className="btn">
              订阅日历
            </a>
          </Card>

          <Card className="mb-6">
            <h4 className="uppercase mb-4">添加到 Google 日历</h4>
            <a
              href={`https://www.google.com/calendar/render?cid=${encodeURIComponent(urls.webcalURL)}`}
              className="btn"
            >
              添加到 Google 日历
            </a>
          </Card>

          <Card>
            <h4 className="uppercase mb-4">ICS 文件下载</h4>
            <p className="mb-4">
              下载ICS文件后，可以导入到Outlook、Apple日历等应用。
            </p>
            <a href={urls.downloadURL} className="btn">
              下载ICS文件
            </a>
          </Card>
        </>
      )}
    </>
  );
}

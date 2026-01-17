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
          <h3 className="text-xl mb-4">{t('form.title')}</h3>

          <form onSubmit={handleSubmit}>
            <fieldset className="mb-6">
              <legend className="font-semibold mb-3 block">{t('form.eventTypes')}</legend>

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
                  {t('form.includeOpen')}
                </label>

                {form.includeOpen && (
                  <div className="ml-6">
                    <label className="block text-sm mb-2">{t('form.minCategory')}</label>
                    <select
                      value={form.minCategory}
                      onChange={(e) =>
                        setForm({ ...form, minCategory: e.target.value })
                      }
                      className="w-full p-2 border border-themed rounded bg-input text-primary focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="1000">{t('categories.1000')}</option>
                      <option value="750">{t('categories.750')}</option>
                      <option value="500">{t('categories.500')}</option>
                      <option value="300">{t('categories.300')}</option>
                      <option value="100">{t('categories.100')}</option>
                      <option value="all">{t('categories.all')}</option>
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
                  {t('form.includeChampionship')}
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
                  {t('form.includeFinals')}
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
                  {t('form.includeOlympics')}
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
                  {t('form.includeAsianGames')}
                </label>
              </div>
            </fieldset>

            <fieldset className="mb-6">
              <legend className="font-semibold mb-3 block">
                {t('form.sessionTypes')}
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
                  {t('form.includeGroup')}
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
                  {t('form.includeSemifinal')}
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
                  {t('form.includeFinal')}
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
                  {t('form.onlyMajor')}
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
                {t('form.alarm')}
                <select
                  value={form.alarmMinutes}
                  onChange={(e) =>
                    setForm({ ...form, alarmMinutes: parseInt(e.target.value) })
                  }
                  disabled={form.alarmMinutes === 0}
                  className="ml-2 p-1 px-3 border border-themed rounded bg-input text-primary focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm min-w-[100px] w-auto"
                >
                  <option value="30">30 {t('form.alarmMinutes')}</option>
                  <option value="60">60 {t('form.alarmMinutes')}</option>
                  <option value="90">90 {t('form.alarmMinutes')}</option>
                  <option value="120">120 {t('form.alarmMinutes')}</option>
                </select>
              </label>
            </fieldset>

            <button type="submit" className="btn">
              {t('form.button')}
            </button>
          </form>
        </Card>
      ) : (
        <>
          <h3 className="text-xl mb-4">{t('download.title')}</h3>

          <Card className="mb-6">
            <h4 className="uppercase mb-4">{t('download.webcalTitle')}</h4>
            <p className="mb-4">
              {t('download.webcalDescription')}
            </p>
            <a href={urls.webcalURL} className="btn">
              {t('download.webcalButton')}
            </a>
          </Card>

          <Card className="mb-6">
            <h4 className="uppercase mb-4">{t('download.gcalTitle')}</h4>
            <a
              href={`https://www.google.com/calendar/render?cid=${encodeURIComponent(urls.webcalURL)}`}
              className="btn"
            >
              {t('download.gcalAddToGoogleCalendar')}
            </a>
          </Card>

          <Card>
            <h4 className="uppercase mb-4">{t('download.icsTitle')}</h4>
            <p className="mb-4">
              {t('download.icsDescription')}
            </p>
            <a href={urls.downloadURL} className="btn">
              {t('download.icsButton')}
            </a>
          </Card>
        </>
      )}
    </>
  );
}

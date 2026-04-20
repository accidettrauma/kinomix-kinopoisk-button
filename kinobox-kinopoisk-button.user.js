// ==UserScript==
// @name         Kinobox Button for Kinopoisk
// @namespace    https://github.com/accidettrauma/kinobox-kinopoisk-button
// @version      0.1
// @description  Круглая кнопка рядом с кнопкой "Буду смотреть"
// @author       accidettrauma
// @match        https://www.kinopoisk.ru/film/*
// @match        https://www.kinopoisk.ru/series/*
// @grant        none
// @run-at       document-end
// @icon         https://raw.githubusercontent.com/accidettrauma/kinobox-kinopoisk-button/main/icon.png
// @downloadURL  https://raw.githubusercontent.com/accidettrauma/kinobox-kinopoisk-button/main/kinobox-kinopoisk-button.user.js
// @updateURL    https://raw.githubusercontent.com/accidettrauma/kinobox-kinopoisk-button/main/kinobox-kinopoisk-button.user.js
// ==/UserScript==

(function () {
    'use strict';

    function getFilmId() {
        return location.pathname.match(/\/(film|series)\/(\d+)/)?.[2];
    }

    function createButton(filmId, container) {
        if (document.getElementById('kinobox-gray-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'kinobox-gray-btn';

        btn.style.cssText = `
            width: 52px !important;
            height: 52px !important;
            min-width: 52px !important;
            padding: 0 !important;
            margin-left: 6px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            border-radius: 50% !important;
            background: #f0f0f0 !important;
            border: 1px solid #e0e0e0 !important;
            cursor: pointer !important;
            transition: all 0.25s ease !important;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15) !important;
            color: #1f1f1f !important;
        `;

        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" style="transition: transform 0.25s ease;">
                <path fill="currentColor" d="m10 16.5l6-4.5l-6-4.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8"/>
            </svg>
        `;

        const svg = btn.querySelector('svg');

        // Hover эффект
        btn.onmouseenter = () => {
            btn.style.background = '#e0e0e0';
            btn.style.color = '#ff5500';
            btn.style.transform = 'scale(1.08)';
            svg.style.transform = 'scale(1.12)';
        };

        btn.onmouseleave = () => {
            btn.style.background = '#f0f0f0';
            btn.style.color = '#1f1f1f';
            btn.style.transform = 'scale(1)';
            svg.style.transform = 'scale(1)';
        };

        btn.title = 'Смотреть на kinobox';

        btn.onclick = (e) => {
            e.stopImmediatePropagation();
            window.open(`https://kinobox.in/movie/${filmId}/`, '_blank');
        };

        container.appendChild(btn);
        console.log(`[kinobox] Кнопка добавлена для ID ${filmId}`);
    }

    function init() {
        const interval = setInterval(() => {
            const container = document.querySelector('div[class*="buttonsContainer"]');
            const filmId = getFilmId();

            if (container && filmId) {
                clearInterval(interval);
                createButton(filmId, container);
            }
        }, 500);
    }

    init();

    // Поддержка смены страниц на Кинопоиске
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(init, 1000);
        }
    }).observe(document, { subtree: true, childList: true });

})();

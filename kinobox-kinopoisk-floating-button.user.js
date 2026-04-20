// ==UserScript==
// @name         Kinobox Floating Button
// @namespace    https://github.com/accidettrauma/kinobox-kinopoisk-button
// @version      0.1
// @description  Плавающая кнопка kinobox слева от карточки фильма (стабильный вариант)
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

    function createFloatingButton(filmId) {
        if (document.getElementById('kinobox-floating-btn')) return;

        const btn = document.createElement('div');
        btn.id = 'kinobox-floating-btn';
        
        btn.style.cssText = `
            position: fixed;
            left: 25px;
            top: 45%;
            transform: translateY(-50%);
            width: 62px;
            height: 62px;
            background: #f0f0f0;
            border: 3px solid #e0e0e0;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 999999;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);
            transition: all 0.3s ease;
            user-select: none;
        `;

        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none">
                <path fill="#1f1f1f" d="m10 16.5l6-4.5l-6-4.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8"/>
            </svg>
        `;

        const svg = btn.querySelector('svg');

        btn.onclick = (e) => {
            e.stopImmediatePropagation();
            window.open(`https://kinobox.in/movie/${filmId}/`, '_blank');
        };

        btn.onmouseenter = () => {
            btn.style.background = '#ff5500';
            btn.style.borderColor = '#ff8800';
            btn.style.transform = 'translateY(-50%) scale(1.15)';
            svg.style.fill = '#ffffff';
        };

        btn.onmouseleave = () => {
            btn.style.background = '#f0f0f0';
            btn.style.borderColor = '#e0e0e0';
            btn.style.transform = 'translateY(-50%)';
            svg.style.fill = '#1f1f1f';
        };

        btn.title = 'Открыть на kinobox';

        document.body.appendChild(btn);
        console.log(`[kinobox Floating] Кнопка добавлена для ID ${filmId}`);
    }

    function init() {
        const interval = setInterval(() => {
            const filmId = getFilmId();
            if (filmId) {
                clearInterval(interval);
                createFloatingButton(filmId);
            }
        }, 600);
    }

    init();

    // Следим за сменой страницы
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(init, 800);
        }
    }).observe(document, { subtree: true, childList: true });

})();

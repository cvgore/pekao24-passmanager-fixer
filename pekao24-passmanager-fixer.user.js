// ==UserScript==
// @name         pekao24 fix password manager autofill
// @namespace    http://userscripts.cvgo.re/
// @version      0.1
// @description  try to take over the world!
// @author       cvgore
// @match        https://pekao24.pl/logowanie
// @match        https://pekao24.pl/
// @match        https://www.pekao24.pl/logowanie
// @match        https://www.pekao24.pl/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pekao24.pl
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const stepBoxObserver = new MutationObserver((list) => {
        console.log('maybe activating step two');
        if (list.length > 0
            && list.some(m => m.type === 'attributes' && m.attributeName === 'class' && m.target.classList.contains('login-password') && m.target.nodeName.toUpperCase() === 'PEKAO-LOGIN-STEP-BOX')
           ) {
            setTimeout(() => {
                bindToStepTwo()
                stepBoxObserver.disconnect()
            }, 0)
        }
    });
    stepBoxObserver.observe(
        document.querySelector('pekao-root-pekao24'),
        {
            attributes: true,
            attributesFilter: ['class'],
            subtree: true,
        }
    )

    function triggerFakeInputEventOnPasswordMaskedFields() {
        // triggering fake input event on all masked input fields revalidates login form
        document.querySelectorAll('pekao-masked-input-field input').forEach(el => {
            el.dispatchEvent(new Event('input', {
                bubbles: true,
                cancelable: true
            }))
        })
    }

    function bindToStepTwo() {
        console.log('activating step two');
        const loginBtn = document.querySelector('pekao-login-password-footer pekao-button.action-bar-button.main-action button')
        const observer = new MutationObserver(loginAction);

        function loginAction() {
            triggerFakeInputEventOnPasswordMaskedFields()
            observer.disconnect()
        }

        loginBtn.addEventListener('click', loginAction)
        observer.observe(
            document.querySelector('pekao-masked-input-field input:last-of-type'),
            {
                attributes: true,
                attributesFilter: ['value'],
            }
        )
    }
})();

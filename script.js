/**
 * LANDING PAGE BLACK FRIDAY - PPS E HOLDING
 * Dra. Mariana Arteiro, Jonatas Albino & João Teixeira
 * Lógica de Versões (A, B, C), Cronômetro, Swiper e Contador de Ancoragem
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ====================================================
       0. CONTROLE DE VERSÃO AUTOMÁTICO POR DATA (A, B ou C)
       Permite forçar via parâmetro na URL: ?v=A, ?v=B, ?v=C
       Caso sem parâmetro, calcula automaticamente pela data:
       - Até 09/11/2026 23:59:59 -> Versão A
       - 10/11 e 11/11/2026 até 23:59:59 -> Versão B
       - A partir de 12/11/2026 00:00:00 -> Versão C
       ==================================================== */
    function getAutoVersion() {
        const now = new Date();
        const cutoffA = new Date(2026, 10, 9, 23, 59, 59); // 09/11 23:59:59
        const cutoffB = new Date(2026, 10, 11, 23, 59, 59); // 11/11 23:59:59

        if (now <= cutoffA) {
            return 'A';
        } else if (now <= cutoffB) {
            return 'B';
        } else {
            return 'C';
        }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const paramVersion = urlParams.get('v') || urlParams.get('versao');
    const currentVersion = (paramVersion ? paramVersion.toUpperCase() : getAutoVersion());

    document.body.classList.remove('version-a', 'version-b', 'version-c');
    if (currentVersion === 'B') {
        document.body.classList.add('version-b');
    } else if (currentVersion === 'C') {
        document.body.classList.add('version-c');
    } else {
        document.body.classList.add('version-a');
    }

    /* ====================================================
       1. CRONÔMETRO REGRESSIVO (TOPO FIXO)
       Versão A: 09/11 às 23:59:59
       Versão B: 11/11 às 23:59:59
       ==================================================== */
    let targetDate;
    if (currentVersion === 'B') {
        targetDate = new Date(2026, 10, 11, 23, 59, 59).getTime(); // 11 de Novembro
    } else {
        targetDate = new Date(2026, 10, 9, 23, 59, 59).getTime();  // 09 de Novembro
    }

    const elDays = document.getElementById('days');
    const elHours = document.getElementById('hours');
    const elMinutes = document.getElementById('minutes');
    const elSeconds = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        let diff = targetDate - now;

        if (diff < 0) {
            diff = 0;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (elDays) elDays.textContent = String(days).padStart(2, '0');
        if (elHours) elHours.textContent = String(hours).padStart(2, '0');
        if (elMinutes) elMinutes.textContent = String(minutes).padStart(2, '0');
        if (elSeconds) elSeconds.textContent = String(seconds).padStart(2, '0');
    }

    if (currentVersion !== 'C') {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }


    /* ====================================================
       2. SWIPER - CARROSSEL DOS 12 PRODUTOS
       ==================================================== */
    if (typeof Swiper !== 'undefined') {
        new Swiper('.products-swiper', {
            slidesPerView: 1.2,
            spaceBetween: 16,
            centeredSlides: false,
            loop: true,
            autoplay: {
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                480: {
                    slidesPerView: 1.8,
                    spaceBetween: 18,
                },
                768: {
                    slidesPerView: 2.8,
                    spaceBetween: 22,
                },
                1024: {
                    slidesPerView: 3.8,
                    spaceBetween: 24,
                },
                1200: {
                    slidesPerView: 4,
                    spaceBetween: 28,
                }
            }
        });
    }


    /* ====================================================
       3. CONTADOR AUTOMÁTICO DE ANCORAGEM (R$ 13.852,00)
       ==================================================== */
    const anchorCounter = document.getElementById('anchorCounter');
    const strikethroughLine = document.getElementById('strikethroughLine');
    const anchorWrapper = document.getElementById('anchorCounterWrapper');
    let hasAnimatedAnchor = false;

    function formatCurrencyBR(val) {
        return val.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function animateAnchorCounter() {
        if (hasAnimatedAnchor || !anchorCounter) return;
        hasAnimatedAnchor = true;

        // Versão A: R$ 13.852,00 | Versão B: R$ 13.681,00 | Versão C: R$ 12.787,00 (sem e-books e sem as 3 aulas/academia)
        let targetValue = 13681.00;
        if (currentVersion === 'A') {
            targetValue = 13852.00;
        } else if (currentVersion === 'C') {
            targetValue = 12787.00;
        }

        const duration = 1800; // 1.8s
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = targetValue * easeProgress;

            anchorCounter.textContent = formatCurrencyBR(currentVal);

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                anchorCounter.textContent = formatCurrencyBR(targetValue);
                // Ativa o risco vermelho após a contagem finalizar
                setTimeout(() => {
                    if (strikethroughLine) strikethroughLine.classList.add('active');
                }, 200);
            }
        }

        requestAnimationFrame(updateCounter);
    }

    if (anchorWrapper && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateAnchorCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.35 });

        observer.observe(anchorWrapper);
    } else if (anchorCounter) {
        animateAnchorCounter();
    }


    /* ====================================================
       4. TRILHA VERTICAL COM LINHA DE LUZ (PILARES)
       ==================================================== */
    function setupScrollTrail(trailId, lineProgressId, stepSelector) {
        const trail = document.getElementById(trailId);
        const progress = document.getElementById(lineProgressId);
        if (!trail || !progress) return;

        const steps = trail.querySelectorAll(stepSelector);

        function updateTrail() {
            const trailRect = trail.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            const focalPoint = windowHeight * 0.65;
            const relativeOffset = focalPoint - trailRect.top;
            const totalHeight = trailRect.height;
            
            let percent = (relativeOffset / totalHeight) * 100;
            percent = Math.max(0, Math.min(100, percent));

            progress.style.height = `${percent}%`;

            steps.forEach((step) => {
                const nodeWrap = step.querySelector('.trail-node-wrap') || step;
                const nodeRect = nodeWrap.getBoundingClientRect();
                
                if (nodeRect.top <= windowHeight * 0.70) {
                    step.classList.add('active');
                }
            });
        }

        window.addEventListener('scroll', updateTrail, { passive: true });
        window.addEventListener('resize', updateTrail, { passive: true });
        updateTrail();
    }

    setupScrollTrail('pillarsTrail', 'pillarsLineProgress', '.pillar-trail-step');

});



    /* Toggle da Opção 2 - Acordeão de Detalhes */
    const toggleBtn = document.getElementById('toggleReceiptDetails');
    const detailsContainer = document.getElementById('receiptDetails');
    const toggleText = document.getElementById('toggleText');
    const toggleIcon = document.getElementById('toggleIcon');

    if (toggleBtn && detailsContainer) {
        toggleBtn.addEventListener('click', () => {
            const isActive = detailsContainer.classList.toggle('active');
            if (isActive) {
                if (toggleText) toggleText.textContent = 'Ocultar discriminação dos 20 itens';
                if (toggleIcon) toggleIcon.className = 'ph-bold ph-caret-up';
            } else {
                if (toggleText) toggleText.textContent = 'Ver discriminação completa dos 20 itens';
                if (toggleIcon) toggleIcon.className = 'ph-bold ph-caret-down';
            }
        });
    }


    /* ====================================================
       RISCO VERMELHO SEQUENCIAL INDIVIDUAL NOS VALORES
       Dispara quando a tabela entra no campo de visão
       ==================================================== */
    const minimalContainer = document.getElementById('minimalItemsContainer');
    const priceWraps = document.querySelectorAll('.minimal-price-wrap');
    let hasAnimatedStrikes = false;

    function triggerSequentialStrikes() {
        if (hasAnimatedStrikes || !priceWraps.length) return;
        hasAnimatedStrikes = true;

        priceWraps.forEach((wrap, index) => {
            // Efeito cascata: cada linha é riscada com 85ms de intervalo
            setTimeout(() => {
                wrap.classList.add('striked');
            }, index * 85);
        });
    }

    if (minimalContainer && 'IntersectionObserver' in window) {
        const strikeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    triggerSequentialStrikes();
                    strikeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });

        strikeObserver.observe(minimalContainer);
    } else {
        setTimeout(triggerSequentialStrikes, 1000);
    }


    /* ====================================================
       ANIMAÇÃO EM CASCATA DOS PREÇOS RISCADOS AO ROLAR A TELA
       Conforme o usuário chega perto, os riscos cortam de cima para baixo
       ==================================================== */
    const masterCard = document.querySelector('.anchor-minimal-container') || document.querySelector('.anchor-section');
    let hasTriggeredStrikes = false;

    function triggerCascadeStrikes() {
        if (hasTriggeredStrikes) return;
        hasTriggeredStrikes = true;

        // Pega apenas as tags que estão realmente visíveis no momento na versão ativa
        const visibleStrikeTags = Array.from(document.querySelectorAll('.strike-price-tag')).filter(tag => {
            return tag.offsetParent !== null;
        });

        visibleStrikeTags.forEach((tag, index) => {
            // Intervalo de 80ms entre cada linha para um efeito cascata dinâmico
            setTimeout(() => {
                tag.classList.add('struck');
            }, index * 80);
        });
    }

    if (masterCard && 'IntersectionObserver' in window) {
        // Dispara quando o card começa a entrar no campo de visão do usuário (20% visível)
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    triggerCascadeStrikes();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        observer.observe(masterCard);
    } else {
        // Fallback caso não suporte observer
        triggerCascadeStrikes();
    }
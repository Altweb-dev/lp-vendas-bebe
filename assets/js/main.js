// Script para a Landing Page do Curso "Nasceu Meu Bebê, O Que Eu Faço?"

document.addEventListener('DOMContentLoaded', function() {
    // Captura e armazena parâmetros UTM da URL
    captureUtmParameters();
    
    // Adiciona os parâmetros UTM aos links de checkout
    applyUtmToCheckoutLinks();
    
    // Animação de elementos ao carregar a página
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        element.style.opacity = '1';
    });

    // Funcionalidade de acordeão para o conteúdo do curso
    const contentHeaders = document.querySelectorAll('.content-header');
    
    contentHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const contentBody = this.nextElementSibling;
            const isActive = contentBody.classList.contains('active');
            
            // Fecha todos os itens abertos
            document.querySelectorAll('.content-body').forEach(item => {
                item.classList.remove('active');
            });
            
            // Altera os ícones para todos os itens
            document.querySelectorAll('.toggle-icon').forEach(icon => {
                icon.textContent = '+';
            });
            
            // Se o item clicado não estava ativo, abre-o
            if (!isActive) {
                contentBody.classList.add('active');
                this.querySelector('.toggle-icon').textContent = '-';
            }
        });
    });

    // Smooth scroll para links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contador regressivo para criar senso de urgência
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        // Define o tempo para 48 horas (em segundos)
        let timeLeft = 48 * 60 * 60;
        
        function updateCountdown() {
            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);
            const seconds = timeLeft % 60;
            
            countdownElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft > 0) {
                timeLeft--;
                setTimeout(updateCountdown, 1000);
            } else {
                countdownElement.parentElement.textContent = "Oferta encerrada!";
            }
        }
        
        updateCountdown();
    }

    // Botão de voltar ao topo
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Controle do CTA fixo para mobile
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        let lastScrollTop = 0;
        let isHidden = false;
        
        // Verifica se é um dispositivo móvel
        const isMobile = window.innerWidth <= 768;
        
        if (!isMobile) {
            stickyCta.style.display = 'none';
        } else {
            window.addEventListener('scroll', function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Esconde o CTA quando o usuário estiver no topo da página ou na seção de preço
                const pricingSection = document.getElementById('pricing');
                const isInPricingSection = pricingSection && 
                    scrollTop >= (pricingSection.offsetTop - window.innerHeight / 2) && 
                    scrollTop <= (pricingSection.offsetTop + pricingSection.offsetHeight);
                
                if (scrollTop < 300 || isInPricingSection) {
                    if (!isHidden) {
                        stickyCta.classList.add('hidden');
                        isHidden = true;
                    }
                } else {
                    // Mostra o CTA quando o usuário está rolando para cima
                    if (scrollTop < lastScrollTop && isHidden) {
                        stickyCta.classList.remove('hidden');
                        isHidden = false;
                    }
                    // Esconde o CTA quando o usuário está rolando para baixo
                    else if (scrollTop > lastScrollTop + 50 && !isHidden) {
                        stickyCta.classList.add('hidden');
                        isHidden = true;
                    }
                }
                
                lastScrollTop = scrollTop;
            });
        }
    }
});

// Função para capturar parâmetros UTM da URL e armazená-los no localStorage
function captureUtmParameters() {
    // Lista de parâmetros UTM que queremos capturar
    const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    
    // Obter todos os parâmetros da URL atual
    const urlParams = new URLSearchParams(window.location.search);
    
    // Verificar se há parâmetros UTM na URL
    let hasUtmParams = false;
    
    // Armazenar cada parâmetro UTM encontrado
    utmParams.forEach(param => {
        if (urlParams.has(param)) {
            localStorage.setItem(param, urlParams.get(param));
            hasUtmParams = true;
        }
    });
    
    // Se encontramos parâmetros UTM, armazenamos a data para controle de expiração
    if (hasUtmParams) {
        localStorage.setItem('utm_timestamp', Date.now());
    }
}

// Função para aplicar os parâmetros UTM armazenados aos links de checkout
function applyUtmToCheckoutLinks() {
    // Lista de parâmetros UTM que queremos incluir nos links
    const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    
    // Verificar se temos parâmetros UTM armazenados
    let hasStoredUtm = false;
    utmParams.forEach(param => {
        if (localStorage.getItem(param)) {
            hasStoredUtm = true;
        }
    });
    
    // Se não temos parâmetros UTM armazenados, não há nada a fazer
    if (!hasStoredUtm) {
        return;
    }
    
    // Selecionar todos os links de checkout (links que contêm "hotmart.com")
    const checkoutLinks = document.querySelectorAll('a[href*="hotmart.com"]');
    
    // Para cada link de checkout, adicionar os parâmetros UTM
    checkoutLinks.forEach(link => {
        const href = link.getAttribute('href');
        const url = new URL(href);
        
        // Adicionar os parâmetros src e sck se não existirem na URL
        if (!url.searchParams.has('src') && localStorage.getItem('utm_source')) {
            url.searchParams.set('src', localStorage.getItem('utm_source'));
        }
        
        if (!url.searchParams.has('sck') && localStorage.getItem('utm_medium')) {
            url.searchParams.set('sck', localStorage.getItem('utm_medium'));
        }
        
        // Adicionar todos os parâmetros UTM armazenados
        utmParams.forEach(param => {
            if (localStorage.getItem(param)) {
                url.searchParams.set(param, localStorage.getItem(param));
            }
        });
        
        // Atualizar o link com os parâmetros UTM
        link.setAttribute('href', url.toString());
    });
}

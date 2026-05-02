export function renderTopBar(target) {
    if (!target) return;

    if (!document.getElementById('topbarLogoNavStyles')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'topbarLogoNavStyles';
        styleEl.textContent = `
            .topbar-logo-link {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border-radius: 10px;
                padding: 4px 8px;
                transition: transform 0.16s ease, opacity 0.16s ease, box-shadow 0.16s ease;
                text-decoration: none;
            }
            .topbar-logo-link:hover {
                transform: translateY(-1px) scale(1.01);
                opacity: 0.92;
                box-shadow: 0 6px 18px rgba(11, 43, 106, 0.15);
            }
            .topbar-logo-link:active,
            .topbar-logo-link.is-pressed {
                transform: translateY(0) scale(0.98);
                opacity: 0.85;
            }
        `;
        document.head.appendChild(styleEl);
    }

    target.innerHTML = `
    <nav class="top-bar">
        <div class="d-flex align-items-center">
            <button class="mobile-toggle me-3" onclick="toggleSidebar()">
                <i class="bi bi-list"></i>
            </button>
            <div class="input-group d-none d-md-flex" style="width: 250px;">
                <span class="input-group-text bg-light border-end-0 rounded-start-pill text-muted" data-topbar-search-button><i class="bi bi-search"></i></span>
                <input type="text" class="form-control bg-light border-start-0 rounded-end-pill" placeholder="Search..." data-topbar-search-input>
            </div>
        </div>
        <div class="logo-center">
            <a href="/home.html" class="topbar-logo-link" data-topbar-home-link aria-label="Kembali ke halaman home">
                <img src="https://www.dialogika.co/assets/img/logo.webp" alt="Dialogika Logo" style="height:35px;">
            </a>
        </div>
        <div class="d-flex align-items-center gap-3">
            <div class="text-end d-none d-lg-block lh-1">
                <span id="user-name-display" class="d-block fw-bold small text-dark">Loading...</span>
                <small id="user-role-display" class="text-muted" style="font-size:0.7rem">User</small>
            </div>
            <div class="profile-dropdown-wrapper">
                <div class="profile-img-container" id="profileDropdownToggle">
                    <img id="user-photo-display" src="https://i.pravatar.cc/300" alt="Profile" class="profile-img">
                </div>
                <div class="profile-dropdown-menu" id="profileDropdownMenu">
                    <div class="profile-dropdown-header">
                        <div class="profile-dropdown-avatar">
                            <img id="profile-dropdown-photo" src="https://i.pravatar.cc/300" alt="Profile">
                        </div>
                        <div class="profile-dropdown-info">
                            <div id="profile-dropdown-name" class="profile-dropdown-name">Loading...</div>
                            <div id="profile-dropdown-email" class="profile-dropdown-email">user@example.com</div>
                        </div>
                    </div>
                    <div class="profile-dropdown-body">
                        <a href="/personal/profile.html" class="profile-dropdown-item" data-menu-profile>
                            <i class="bi bi-person-circle"></i>
                            <span>Profile</span>
                        </a>
                        <a href="/personal/setting.html" class="profile-dropdown-item" data-menu-setting>
                            <i class="bi bi-gear"></i>
                            <span>Setting</span>
                        </a>
                        <a href="/personal/portfolio.html" class="profile-dropdown-item" data-menu-portfolio>
                            <i class="bi bi-briefcase"></i>
                            <span>Portfolio</span>
                        </a>
                        <div class="profile-dropdown-accordion" data-accordion="form">
                            <button class="profile-dropdown-item profile-dropdown-accordion-toggle" type="button" data-accordion-toggle="form">
                                <i class="bi bi-file-earmark-text"></i>
                                <span>Form</span>
                                <i class="bi bi-chevron-down ms-auto" data-accordion-chevron="form"></i>
                            </button>
                            <div class="profile-dropdown-accordion-content" data-accordion-content="form">
                                <a href="/personal/form-permit.html" class="profile-dropdown-item" data-menu-permit>
                                    <span>Permit</span>
                                </a>
                                <a href="/personal/form-reimburse.html" class="profile-dropdown-item" data-menu-reimburse>
                                    <span>Reimburse</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="profile-dropdown-divider"></div>
                    <button class="profile-dropdown-item profile-dropdown-logout" type="button" data-profile-logout>
                        <i class="bi bi-box-arrow-right"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    </nav>
    `;

    const wrapper = target.querySelector('.profile-dropdown-wrapper');
    const toggle = target.querySelector('#profileDropdownToggle');
    const menu = target.querySelector('#profileDropdownMenu');
    const mainPhoto = target.querySelector('#user-photo-display');
    const dropdownPhoto = target.querySelector('#profile-dropdown-photo');
    const dropdownName = target.querySelector('#profile-dropdown-name');
    const dropdownEmail = target.querySelector('#profile-dropdown-email');
    const nameDisplay = target.querySelector('#user-name-display');
    const roleDisplay = target.querySelector('#user-role-display');
    const homeLogoLink = target.querySelector('[data-topbar-home-link]');

    if (mainPhoto && dropdownPhoto) {
        dropdownPhoto.src = mainPhoto.src;
    }

    try {
        const raw = localStorage.getItem('userData');
        if (raw) {
            const data = JSON.parse(raw);
            const displayName = data.name || data.email || '';
            const displayRole = data.position || 'Staff';
            const photoUrl = data.photo || '';

            if (nameDisplay) nameDisplay.textContent = displayName;
            if (roleDisplay) roleDisplay.textContent = displayRole;
            if (dropdownName) dropdownName.textContent = displayName;
            if (dropdownEmail) dropdownEmail.textContent = data.email || '';

            if (photoUrl) {
                if (mainPhoto) mainPhoto.src = photoUrl;
                if (dropdownPhoto) dropdownPhoto.src = photoUrl;
            }
        }
    } catch (e) {}

    if (toggle && menu && wrapper) {
        toggle.addEventListener('click', function (ev) {
            ev.stopPropagation();
            menu.classList.toggle('show');
        });
        document.addEventListener('click', function (ev) {
            if (!menu.classList.contains('show')) return;
            if (!wrapper.contains(ev.target)) {
                menu.classList.remove('show');
            }
        });
    }

    const logoutBtn = target.querySelector('[data-profile-logout]');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (ev) {
            ev.preventDefault();
            if (typeof window.logout === 'function') {
                window.logout();
            } else {
                try {
                    localStorage.removeItem('userData');
                } catch (e) {}
                window.location.href = 'index.html';
            }
        });
    }

    const settingLink = target.querySelector('[data-menu-setting]');
    const portfolioLink = target.querySelector('[data-menu-portfolio]');

    function attachUnderDevelopment(linkEl) {
        if (!linkEl) return;
        linkEl.addEventListener('click', function (ev) {
            ev.preventDefault();
            alert('under development');
        });
    }

    attachUnderDevelopment(settingLink);
    attachUnderDevelopment(portfolioLink);

    const accordionToggles = target.querySelectorAll('[data-accordion-toggle]');
    accordionToggles.forEach(function (toggleEl) {
        const key = toggleEl.getAttribute('data-accordion-toggle');
        if (!key) return;
        const contentEl = target.querySelector('[data-accordion-content="' + key + '"]');
        const chevronEl = target.querySelector('[data-accordion-chevron="' + key + '"]');
        if (!contentEl) return;
        contentEl.style.display = 'none';
        toggleEl.addEventListener('click', function (ev) {
            ev.preventDefault();
            const isHidden = contentEl.style.display === 'none';
            contentEl.style.display = isHidden ? 'block' : 'none';
            if (chevronEl) {
                chevronEl.style.transform = isHidden ? 'rotate(180deg)' : '';
            }
        });
    });

    const searchInput = target.querySelector('[data-topbar-search-input]');
    const searchButton = target.querySelector('[data-topbar-search-button]');

    function attachSearchUnderDevelopment(inputEl, buttonEl) {
        function trigger() {
            alert('under development');
        }
        if (buttonEl) {
            buttonEl.addEventListener('click', function (ev) {
                ev.preventDefault();
                trigger();
            });
        }
        if (inputEl) {
            inputEl.addEventListener('keydown', function (ev) {
                if (ev.key === 'Enter') {
                    ev.preventDefault();
                    trigger();
                }
            });
        }
    }

    attachSearchUnderDevelopment(searchInput, searchButton);

    if (homeLogoLink) {
        homeLogoLink.addEventListener('click', function (ev) {
            ev.preventDefault();
            homeLogoLink.classList.add('is-pressed');
            window.location.assign('/home.html');
        });
    }
}

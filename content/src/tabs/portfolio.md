---
layout: tab.njk
title: Portfolio
permalink: "/portfolio/"
---

<style>
/* Portfolio specific styles */
.portfolio-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 50px;
    gap: 30px;
}

.portfolio-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.portfolio-icon {
    width: 150px;
    height: 150px;
    object-fit: cover;
    /* Add octagonal clip-path to match containers */
    clip-path: polygon(
        var(--container-corner-cut) 0%, 
        calc(100% - var(--container-corner-cut)) 0%, 
        100% var(--container-corner-cut), 
        100% calc(100% - var(--container-corner-cut)), 
        calc(100% - var(--container-corner-cut)) 100%, 
        var(--container-corner-cut) 100%, 
        0% calc(100% - var(--container-corner-cut)), 
        0% var(--container-corner-cut)
    );
}

.portfolio-title-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.portfolio-title {
    margin-bottom: 0 !important;
    font-size: 1.8rem;
}

.portfolio-title::after {
    display: none;
}

.portfolio-date {
    font-size: 1.2rem;
    font-style: italic;
    color: var(--border-color);
}

.portfolio-description {
    line-height: 1.6;
}

.portfolio-link {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 8px 20px;
    background-color: var(--border-color);
    color: var(--text-color);
    text-decoration: none;
    font-weight: 500;
    transition: background-color var(--transition-speed);
    margin-top: 10px;
    cursor: pointer;
    height: 42px;
    line-height: 22px;
    border: none;
    z-index: 1;
    /* Hexagonal shape using clip-path */
    clip-path: polygon(var(--corner-cut) 0%, calc(100% - var(--corner-cut)) 0%, 100% 50%, calc(100% - var(--corner-cut)) 100%, var(--corner-cut) 100%, 0% 50%);
}

/* GitHub link special styling */
.portfolio-link.github-link:hover {
    background-color: #6d40c8;
}

/* Pseudo-element for border effect with rounded corners */
.portfolio-link::before {
    content: '';
    position: absolute;
    top: var(--border-width);
    left: var(--border-width);
    right: var(--border-width);
    bottom: var(--border-width);
    background-color: var(--bg-color);
    z-index: -1;
    /* Calculate inset hexagonal shape */
    clip-path: polygon(
        calc(var(--corner-cut) - var(--border-width) * 0.5) 0%, 
        calc(100% - var(--corner-cut) + var(--border-width) * 0.5) 0%, 
        calc(100% - var(--border-width) * 0.5) 50%, 
        calc(100% - var(--corner-cut) + var(--border-width) * 0.5) 100%, 
        calc(var(--corner-cut) - var(--border-width) * 0.5) 100%, 
        calc(var(--border-width) * 0.5) 50%
    );
    transition: all var(--transition-speed);
}

/* Button gradient overlays */
.portfolio-link::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    pointer-events: none;
    transition: opacity var(--transition-speed);
    opacity: 1;
    /* Hexagonal shape using clip-path */
    clip-path: polygon(var(--corner-cut) 0%, calc(100% - var(--corner-cut)) 0%, 100% 50%, calc(100% - var(--corner-cut)) 100%, var(--corner-cut) 100%, 0% 50%);
    /* Gradient overlay, radiating from center */
    background: radial-gradient(
        circle at center,
        transparent 60%,
        var(--bg-color) 120%
    );
}

.portfolio-link:hover {
    background-color: var(--hover-border-color);
}

.portfolio-link:hover::after {
    opacity: 0;
}

.portfolio-link:hover::before {
    background-color: var(--hover-bg);
    top: var(--hover-border-width);
    left: var(--hover-border-width);
    right: var(--hover-border-width);
    bottom: var(--hover-border-width);
    /* Recalculate inset hexagonal shape for thicker border */
    clip-path: polygon(
        calc(var(--corner-cut) - var(--hover-border-width) * 0.5) 0%, 
        calc(100% - var(--corner-cut) + var(--hover-border-width) * 0.5) 0%, 
        100% calc(var(--corner-cut) - var(--hover-border-width) * 0.5), 
        100% calc(100% - var(--corner-cut) + var(--hover-border-width) * 0.5), 
        calc(100% - var(--corner-cut) + var(--hover-border-width) * 0.5) 100%, 
        calc(var(--corner-cut) - var(--hover-border-width) * 0.5) 100%, 
        0% calc(100% - var(--corner-cut) + var(--hover-border-width) * 0.5), 
        0% calc(var(--corner-cut) - var(--hover-border-width) * 0.5)
    );
}

.portfolio-link span {
    position: relative;
    z-index: 3;
    color: var(--text-color); /* Explicitly set the text color */
}

/* Fix for dark mode to ensure text visibility */
@media (prefers-color-scheme: dark) {
    .portfolio-link span {
        color: var(--text-color);
    }
    
    .portfolio-link:hover {
        color: var(--text-color);
    }
}

.portfolio-screenshots {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
}

.screenshot {
    height: 400px;
    width: auto;
    object-fit: contain;
}

/* Make the hexagonal image container for screenshots */
.screenshot-container {
    position: relative;
    display: inline-block;
    overflow: hidden;
    clip-path: polygon(
        var(--container-corner-cut) 0%, 
        calc(100% - var(--container-corner-cut)) 0%, 
        100% var(--container-corner-cut), 
        100% calc(100% - var(--container-corner-cut)), 
        calc(100% - var(--container-corner-cut)) 100%, 
        var(--container-corner-cut) 100%, 
        0% calc(100% - var(--container-corner-cut)), 
        0% var(--container-corner-cut)
    );
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.screenshot-container:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.screenshot-container img {
    display: block;
    height: 400px;
    width: auto;
    transition: transform 0.5s ease;
}

.screenshot-container:hover img {
    transform: scale(1.05);
}

/* Responsive adjustments for portfolio */
@media (max-width: 992px) {
    .portfolio-item {
        flex-direction: column;
    }
    
    .portfolio-header {
        flex-direction: column;
        justify-content: center;
        gap: 15px;
    }
    
    .portfolio-icon {
        width: 100px;
        height: 100px;
        /* Reduce corner clipping for tablet view */
        clip-path: polygon(
            calc(var(--container-corner-cut) * 0.7) 0%, 
            calc(100% - var(--container-corner-cut) * 0.7) 0%, 
            100% calc(var(--container-corner-cut) * 0.7), 
            100% calc(100% - var(--container-corner-cut) * 0.7), 
            calc(100% - var(--container-corner-cut) * 0.7) 100%, 
            calc(var(--container-corner-cut) * 0.7) 100%, 
            0% calc(100% - var(--container-corner-cut) * 0.7), 
            0% calc(var(--container-corner-cut) * 0.7)
        );
    }
    
    .portfolio-title-group {
        align-items: center;
        text-align: center;
    }
    
    .portfolio-description {
        text-align: center;
    }
    
    .screenshot-container {
        /* Reduce corner clipping for tablet view */
        clip-path: polygon(
            calc(var(--container-corner-cut) * 0.7) 0%, 
            calc(100% - var(--container-corner-cut) * 0.7) 0%, 
            100% calc(var(--container-corner-cut) * 0.7), 
            100% calc(100% - var(--container-corner-cut) * 0.7), 
            calc(100% - var(--container-corner-cut) * 0.7) 100%, 
            calc(var(--container-corner-cut) * 0.7) 100%, 
            0% calc(100% - var(--container-corner-cut) * 0.7), 
            0% calc(var(--container-corner-cut) * 0.7)
        );
    }
    
    .screenshot-container img {
        height: 350px;
    }
    
    .third-screenshot {
        display: none;
    }
}

@media (max-width: 576px) {
    .portfolio-header {
        padding: 0 10px;
    }
    
    .portfolio-icon {
        width: 80px;
        height: 80px;
        /* Reduce corner clipping further for mobile view */
        clip-path: polygon(
            calc(var(--container-corner-cut) * 0.5) 0%, 
            calc(100% - var(--container-corner-cut) * 0.5) 0%, 
            100% calc(var(--container-corner-cut) * 0.5), 
            100% calc(100% - var(--container-corner-cut) * 0.5), 
            calc(100% - var(--container-corner-cut) * 0.5) 100%, 
            calc(var(--container-corner-cut) * 0.5) 100%, 
            0% calc(100% - var(--container-corner-cut) * 0.5), 
            0% calc(var(--container-corner-cut) * 0.5)
        );
    }
    
    .screenshot-container {
        /* Reduce corner clipping further for mobile view */
        clip-path: polygon(
            calc(var(--container-corner-cut) * 0.5) 0%, 
            calc(100% - var(--container-corner-cut) * 0.5) 0%, 
            100% calc(var(--container-corner-cut) * 0.5), 
            100% calc(100% - var(--container-corner-cut) * 0.5), 
            calc(100% - var(--container-corner-cut) * 0.5) 100%, 
            calc(var(--container-corner-cut) * 0.5) 100%, 
            0% calc(100% - var(--container-corner-cut) * 0.5), 
            0% calc(var(--container-corner-cut) * 0.5)
        );
    }
    
    .portfolio-title {
        font-size: 1.6rem;
    }
    
    .portfolio-date {
        font-size: 1rem;
    }
    
    .portfolio-link {
        padding: 6px 16px;
        height: 36px;
        line-height: 20px;
        font-size: 0.9rem;
    }
    
    .portfolio-link-icon {
        width: 16px;
        height: 16px;
    }
    
    .portfolio-description {
        padding: 0 10px;
    }
    
    .screenshot-container img {
        height: 300px;
    }
}
</style>

# Portfolio.

<div class="portfolio-item">
    <div class="portfolio-info">
        <div class="section-header">
            <img class="portfolio-icon" src="https://github.com/OxygenCobalt/Auxio/raw/dev/fastlane/metadata/android/en-US/images/icon.png" alt="Auxio App Icon" />
            <div class="section-info">
                <p class="section-title">Auxio</p>
                <p class="section-date">August 2020 - Present</p>
                <a href="https://github.com/OxygenCobalt/Auxio" class="portfolio-link github-link">
                    <span>GitHub</span>
                </a>
            </div>
        </div>
        <div class="section-description">
            I am the <strong>primary maintainer</strong> of a Music Player App for Android with over <strong>1k+ stars</strong> and <strong>15k+ downloads</strong> on GitHub. It is written in <strong>Kotlin</strong> with modern <strong>MVVM</strong> architecture practices and UI/UX design based on <strong>Material Design 3</strong>. As the project grew, I addressed <strong>user needs</strong> and worked with <strong>external contributors</strong> to fix bugs and improve functionality.
        </div>
    </div>
    <div class="portfolio-screenshots">
        <div class="screenshot-container">
            <img src="https://github.com/OxygenCobalt/Auxio/raw/dev/fastlane/metadata/android/en-US/images/phoneScreenshots/shot0.png" alt="Now Playing UI Screenshot" />
        </div>
        <div class="screenshot-container">
            <img src="https://github.com/OxygenCobalt/Auxio/raw/dev/fastlane/metadata/android/en-US/images/phoneScreenshots/shot1.png" alt="Album UI Screenshot" />
        </div>
    </div>
</div>

<hr />

<div class="portfolio-item">
    <div class="portfolio-info">
        <div class="section-header">
            <img class="portfolio-icon" src="/res/mines-acm.png" alt="Mines ACM Logo" />
            <div class="section-info">
                <p class="section-title">Mines ACM Site</p>
                <p class="section-date">June - August 2023</p>
                <a href="https://github.com/ColoradoSchoolOfMines/acm-site" class="portfolio-link github-link">
                    <span>GitHub</span>
                </a>
            </div>
        </div>
        <div class="section-description">
            The new site to be used for the Mines ACM chapter, built with <strong>Bootstrap</strong> on the frontend and <strong>Node.js/Express.js/PostgreSQL</strong> on the backend. I <strong>collaborated</strong> with other contributors on the project's frontend and backend, writing much of <strong>authentication, project management, meeting creation, and attendance systems.</strong>
        </div>
    </div>
    <div class="portfolio-screenshots">
        <div class="screenshot-container" style="width: 100%;">
            <img style="width: 100%; height: auto;" src="/res/mines-acm-homepage.png" alt="Mines ACM Site Homepage" />
        </div>
    </div>
</div>

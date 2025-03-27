---
layout: tab.njk
title: Experience
permalink: "/experience/"
---

<style>
/* Experience specific styles */
.experience-section {
    margin-bottom: 40px;
}

.company-logo {
    max-width: 500px;
    width: auto;
    height: auto;
}

.company-logo.smaller {
    max-width: 350px;
}

.logo-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(250 248 255);
    padding: 30px;
    /* Octagonal shape using clip-path */
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

/* Responsive adjustments */
@media (max-width: 768px) {
    .company-logo {
        max-width: 300px;
    }
    
    .company-logo.smaller {
        max-width: 250px;
    }
    
    .logo-container {
        padding: 10px;
        /* Reduce corner clipping for mobile view */
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
}
</style>

# Experience.


<div class="experience-section">
    <div class="section-header">
        <div class="logo-container">
            <img alt="Ombud" src="/res/ombud.png" class="company-logo" />
        </div>
        <div class="section-info">
            <p class="section-title">Full-Stack Software Engineer Intern</p>
            <p class="section-subtitle">Ombud</p>
            <p class="section-date">May 2024 - August 2024</p>
        </div>
    </div>

    <div class="section-description">
        I worked on a production-grade React web application that natively integrates with Microsoft Excel to empower information workers to efficiently access and utilize Ombud's CRM data. In addition, I also redesigned an internal import tool for employees into a customer-facing self-service importer, significantly improving reliability and flexibility.
    </div>

    <h3 class="section-accomplishments">Notable accomplishments:</h3>
    <ul>
        <li>Developed new CI/CD pipelines for the application with Jenkins</li>
        <li>Deployed containerized services to internal and production environments</li>
        <li>Learned and refactored a large existing codebase to maintainably implement new functionality without regressions</li>
        <li>Engaged with regular unit and QA testing to ensure production-quality code</li>
    </ul>
</div>

<hr />

<div class="experience-section">
    <div class="section-header">
        <div class="logo-container">
            <img alt="OreCart" src="/res/orecart.png" class="company-logo" />
        </div>
        <div class="section-info">
            <p class="section-title">Full-Stack Software Engineer</p>
            <p class="section-subtitle">OreCart Transit Program</p>
            <p class="section-date">August 2023 - June 2024</p>
        </div>
    </div>

    <div class="section-description">
        I worked for the OreCart Transit System on a cross-platform mobile application with <strong>React Native</strong> that allows Golden residents and Mines students to view route information, shuttle locations, and arrival times. I also created on production-grade web backend with <strong>FastAPI</strong> that will allow transit system administrators to view ridership analytics and easily update information when shuttle routes change.
    </div>

    <h3 class="section-accomplishments">Notable accomplishments:</h3>
    <ul>
        <li>Designed a consistent and streamlined mobile application UI/UX with an emphasis on immediate ease-of-use</li>
        <li>Planned a flexible database schema with an emphasis on usability with future management needs</li>
        <li>Scaled the location backend infrastructure to handle 100k+ location requests per hour while still providing accurate arrival time estimates</li>
        <li>Containerized the backend with <strong>Docker</strong> to improve development speed and environment consistency</li>
    </ul>
</div>

<hr />

<div class="experience-section">
    <div class="section-header">
        <div class="logo-container">
            <img alt="Colorado School of Mines" src="/res/mines.png" class="company-logo smaller" />
        </div>
        <div class="section-info">
            <p class="section-title">Teaching Assistant</p>
            <p class="section-subtitle">Colorado School of Mines</p>
            <p class="section-date">January 2024 - Present</p>
        </div>
    </div>

    <div class="section-description">
        I am helping the 40+ students in CSCI448 build their understanding of Android Application Development, alongside assisting Prof. Paone with grading course assignemnts. Previously, I helped the 100+ students of CSCCI200 advance their understanding of the C++ programming language and foundational programming skills.
        <br /><br />
        I serve three office hour sessions per week, in which I assist with course material, the 3-4 programming projects assigned each month, and the semester-long final project.
    </div>
</div>

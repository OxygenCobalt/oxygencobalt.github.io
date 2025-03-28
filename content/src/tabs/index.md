---
layout: tab.njk
title: Home
permalink: "/"
---

# Home.

<div class="blog-grid">
{% for post in collections.blog | reverse %}
  <a href="{{ post.url }}" class="blog-post-widget" hx-get="/partials{{ post.url }}" hx-target="#tab-content" hx-push-url="{{ post.url }}" hx-swap="innerHTML transition:true">
    <div class="blog-post-fade-top"></div>
    <div class="blog-post-fade-bottom"></div>
    <div class="blog-post-content">
      <h3 class="blog-post-title">{{ post.data.title }}</h3>
      <div class="post-meta">
        <span class="post-date">{{ post.date | date: "%m/%d/%Y" }}</span>
      </div>
      <div class="post-summary">{{ post.data.subtitle }}</div>
      <span class="read-more">Read more →</span>
    </div>
  </a>
{% endfor %}
</div> 
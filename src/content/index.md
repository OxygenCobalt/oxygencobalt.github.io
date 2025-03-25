---
layout: base.njk
title: Blog
permalink: "/"
---

# Alexander Capehart

I'm a software developer passionate about creating elegant solutions to complex problems.

This site is built with 11ty and uses HTMX for smooth page transitions while maintaining a lightweight footprint.

## Recent Posts

<div class="blog-list">
{% for post in collections.blog | reverse %}
  <article class="blog-post-preview">
    <h3>
      <a href="{{ post.url }}" hx-get="/partials{{ post.url }}" hx-target="#tab-content" hx-push-url="{{ post.url }}" hx-swap="innerHTML transition:true">
        {{ post.data.title }}
      </a>
    </h3>
    <div class="post-meta">
      <span class="post-date">{{ post.date }}</span>
    </div>
    <div class="post-summary">
      A preview of the post content.
    </div>
    <a href="{{ post.url }}" class="read-more" hx-get="/partials{{ post.url }}" hx-target="#tab-content" hx-push-url="{{ post.url }}" hx-swap="innerHTML transition:true">
      Read more →
    </a>
  </article>
{% endfor %}
</div> 
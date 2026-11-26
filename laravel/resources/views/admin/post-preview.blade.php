<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>{{ $post->meta_title ?: $post->seo_title ?: $post->title }} — Preview | GetIntoFeed</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; }
        body {
            margin: 0;
            font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #f8fafc;
            color: #0f172a;
            line-height: 1.75;
        }
        .preview-banner {
            position: sticky;
            top: 0;
            z-index: 30;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            padding: 10px 20px;
            background: #0f172a;
            color: #f8fafc;
            font-size: 12.5px;
        }
        .preview-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 3px 10px;
            border-radius: 9999px;
            background: rgba(59, 130, 246, 0.25);
            color: #93c5fd;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 11px;
        }
        .preview-container {
            max-width: 780px;
            margin: 28px auto 64px;
            padding: 32px 28px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(15, 23, 42, 0.05);
        }
        @media (max-width: 640px) {
            .preview-container {
                margin: 12px;
                padding: 20px 16px;
                border-radius: 12px;
            }
        }
        .preview-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            font-size: 13px;
            color: #64748b;
            margin-bottom: 14px;
        }
        h1.article-title {
            font-size: clamp(1.65rem, 3.2vw, 2.35rem);
            line-height: 1.25;
            font-weight: 800;
            margin: 0 0 14px;
            color: #0f172a;
        }
        .article-excerpt {
            font-size: 1.05rem;
            color: #475569;
            margin: 0 0 22px;
        }
        .featured-media {
            margin: 0 0 24px;
        }
        .featured-media img {
            width: 100%;
            height: auto;
            border-radius: 12px;
            display: block;
        }
        .article-body { font-size: 16px; color: #1e293b; overflow-wrap: anywhere; }
        .article-body h2 { font-size: 1.5rem; font-weight: 800; margin: 1.75rem 0 0.75rem; color: #0f172a; }
        .article-body h3 { font-size: 1.25rem; font-weight: 700; margin: 1.35rem 0 0.55rem; color: #0f172a; }
        .article-body h4 { font-size: 1.05rem; font-weight: 700; margin: 1.1rem 0 0.45rem; color: #0f172a; }
        .article-body p { margin: 0.85rem 0; }
        .article-body .gif-align-center { text-align: center; }
        .article-body .gif-align-right { text-align: right; }
        .article-body ul { padding-left: 1.5rem; margin: 0.9rem 0; }
        .article-body ol { padding-left: 1.5rem; margin: 0.9rem 0; }
        .article-body blockquote {
            margin: 1.25rem 0;
            padding: 0.9rem 1.25rem;
            border-left: 4px solid #2563eb;
            background: #f8fafc;
            border-radius: 0 8px 8px 0;
            font-style: italic;
        }
        .article-body .gif-table-scroll {
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            margin: 1.25rem 0;
        }
        .article-body table { width: 100%; min-width: 480px; border-collapse: collapse; }
        .article-body th, .article-body td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
        .article-body th { background: #f1f5f9; font-weight: 700; }
        .article-body img { max-width: 100%; height: auto; border-radius: 10px; }
        .article-body figure.gif-image-figure { margin: 1.4rem 0; text-align: center; }
        .article-body figcaption { margin-top: 6px; font-size: 13px; color: #64748b; }
        .article-body figure[data-video-embed] { margin: 1.4rem 0; border-radius: 12px; overflow: hidden; }
        .article-body figure[data-video-embed] iframe { width: 100%; aspect-ratio: 16/9; border: 0; display: block; }
        .article-body div[data-callout] {
            margin: 1.25rem 0;
            padding: 14px 16px;
            border-radius: 10px;
            border-left: 4px solid #2563eb;
            background: #eff6ff;
        }
        .article-body div[data-callout][data-type="tip"] { border-left-color: #059669; background: #ecfdf5; }
        .article-body div[data-callout][data-type="warning"] { border-left-color: #d97706; background: #fffbeb; }
        .article-body .gif-cta-block {
            margin: 1.5rem 0;
            padding: 18px;
            border-radius: 12px;
            border: 1px solid #bfdbfe;
            background: #eff6ff;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }
        .article-body .gif-cta-btn {
            display: inline-flex;
            align-items: center;
            padding: 10px 18px;
            border-radius: 8px;
            background: #2563eb;
            color: #ffffff;
            font-weight: 700;
            text-decoration: none;
        }
        .article-body div[data-faq],
        .article-body div[data-toc] {
            margin: 1.25rem 0;
            padding: 16px;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
            background: #f8fafc;
        }
        .article-body pre {
            background: #09090b;
            color: #e4e4e7;
            padding: 14px 16px;
            border-radius: 10px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <header class="preview-banner">
        <div>
            <span class="preview-badge">Signed Editorial Preview</span>
            <strong style="margin-left: 8px;">{{ strtoupper((string) ($post->status ?: 'draft')) }}</strong>
            <span style="opacity: 0.75; margin-left: 6px;">({{ $post->visibility ?: 'public' }})</span>
        </div>
        <div style="opacity: 0.85;">
            {{ $post->category ?: 'General' }} &bull; {{ $post->read_time ?: (($post->reading_time ?: 1) . ' min read') }}
        </div>
    </header>

    <main class="preview-container">
        <div class="preview-meta">
            <span>By <strong>{{ $post->author?->name ?? $post->author_name ?? 'Editorial Team' }}</strong></span>
            <span>&bull;</span>
            <span>{{ $post->published_at?->timezone('Asia/Kolkata')->format('M d, Y') ?? now('Asia/Kolkata')->format('M d, Y') }} (IST)</span>
            @if($post->focus_keyphrase)
                <span>&bull;</span>
                <span>Keyword: {{ $post->focus_keyphrase }}</span>
            @endif
        </div>

        <h1 class="article-title">{{ $post->title ?: 'Untitled Article' }}</h1>

        @if($post->excerpt)
            <p class="article-excerpt">{{ $post->excerpt }}</p>
        @endif

        @if($post->featuredMedia?->url || $post->featured_image_url)
            <figure class="featured-media">
                <img
                    src="{{ $post->featuredMedia?->url ?? $post->featured_image_url }}"
                    alt="{{ $post->featured_image_alt ?: $post->featuredMedia?->alt_text ?: $post->title }}"
                >
            </figure>
        @endif

        <article class="article-body">
            {!! $renderedHtml !!}
        </article>
    </main>
</body>
</html>

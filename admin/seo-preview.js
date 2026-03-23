// =============================================================
// seo-preview.js — Live SEO Widget for juangervasoni.com
// Registers a custom preview template for the blog collection
// with a real-time SEO analysis sidebar (Yoast-style)
// =============================================================

(function () {
  var h = window.h;
  var createClass = window.createClass;

  // -----------------------------------------------------------
  // SEO Analysis Engine
  // -----------------------------------------------------------
  function analyzeSEO(data) {
    var title = data.title || '';
    var description = data.description || '';
    var body = data.body || '';
    var keyword = data.focus_keyword || '';

    var checks = [];
    var score = 0;
    var maxScore = 0;

    function check(pass, passMsg, failMsg, points) {
      maxScore += points;
      if (pass) {
        score += points;
        checks.push({ pass: true, msg: passMsg, points: points });
      } else {
        checks.push({ pass: false, msg: failMsg, points: points });
      }
    }

    // Title length
    var titleLen = title.length;
    check(
      titleLen >= 50 && titleLen <= 60,
      'Title length is perfect (' + titleLen + ' chars)',
      'Title is ' + titleLen + ' chars — aim for 50–60',
      15
    );

    // Keyword in title
    check(
      keyword && title.toLowerCase().includes(keyword.toLowerCase()),
      'Focus keyword found in title',
      keyword ? 'Add your focus keyword to the title' : 'Set a focus keyword first',
      20
    );

    // Title starts with keyword
    check(
      keyword && title.toLowerCase().startsWith(keyword.toLowerCase()),
      'Title starts with the focus keyword (great!)',
      'Try starting the title with your focus keyword',
      10
    );

    // Meta description length
    var descLen = description.length;
    check(
      descLen >= 120 && descLen <= 160,
      'Meta description length is perfect (' + descLen + ' chars)',
      'Description is ' + descLen + ' chars — aim for 120–160',
      15
    );

    // Keyword in description
    check(
      keyword && description.toLowerCase().includes(keyword.toLowerCase()),
      'Focus keyword in meta description',
      keyword ? 'Add focus keyword to the description' : 'Set a focus keyword first',
      15
    );

    // Content length
    var wordCount = body.split(/\s+/).filter(function (w) { return w.length > 0; }).length;
    check(
      wordCount >= 600,
      'Great content length (' + wordCount + ' words)',
      wordCount >= 300
        ? 'Content is ' + wordCount + ' words — 600+ is ideal for SEO'
        : 'Content too short (' + wordCount + ' words) — aim for 600+',
      15
    );

    // Keyword density
    if (keyword && wordCount > 0) {
      var keywordCount = (body.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
      var density = ((keywordCount / wordCount) * 100).toFixed(1);
      check(
        density >= 0.5 && density <= 2.5,
        'Keyword density is good (' + density + '%)',
        'Keyword density is ' + density + '% — aim for 0.5–2.5%',
        10
      );
    }

    var pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

    return {
      score: pct,
      checks: checks,
      wordCount: wordCount,
      titleLen: titleLen,
      descLen: descLen
    };
  }

  // -----------------------------------------------------------
  // Color helpers
  // -----------------------------------------------------------
  function scoreColor(pct) {
    if (pct >= 75) return '#16a34a';
    if (pct >= 45) return '#d97706';
    return '#dc2626';
  }

  function scoreLabel(pct) {
    if (pct >= 75) return 'Good';
    if (pct >= 45) return 'Needs work';
    return 'Poor';
  }

  // -----------------------------------------------------------
  // Google SERP Snippet Preview
  // -----------------------------------------------------------
  function SerpPreview(title, description, keyword) {
    var displayTitle = title || 'Your Post Title';
    var displayDesc = description || 'Your meta description will appear here...';
    var url = 'juangervasoni.com › blog › your-post-slug';

    // Highlight keyword in snippet
    function highlight(text) {
      if (!keyword) return text;
      var re = new RegExp('(' + keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      return text.replace(re, '<strong>$1</strong>');
    }

    return h('div', {
      style: {
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '12px 14px',
        marginBottom: '16px',
        fontFamily: 'Arial, sans-serif'
      }
    },
      h('p', { style: { fontSize: '11px', color: '#666', margin: '0 0 4px', fontFamily: 'sans-serif' }}, 'SERP Preview'),
      h('div', { style: { fontSize: '12px', color: '#202124' }},
        h('div', { style: { fontSize: '11px', color: '#4d5156', marginBottom: '2px' }}, url),
        h('div', {
          style: { fontSize: '16px', color: '#1a0dab', marginBottom: '4px', lineHeight: 1.3 },
          dangerouslySetInnerHTML: { __html: highlight(displayTitle.slice(0, 65)) }
        }),
        h('div', {
          style: { fontSize: '13px', color: '#4d5156', lineHeight: 1.5 },
          dangerouslySetInnerHTML: { __html: highlight(displayDesc.slice(0, 165)) }
        })
      )
    );
  }

  // -----------------------------------------------------------
  // Main Preview Component
  // -----------------------------------------------------------
  var BlogPreview = createClass({
    render: function () {
      var entry = this.props.entry;
      var title = entry.getIn(['data', 'title']) || '';
      var description = entry.getIn(['data', 'description']) || '';
      var body = entry.getIn(['data', 'body']) || '';
      var keyword = entry.getIn(['data', 'focus_keyword']) || '';

      var seo = analyzeSEO({ title: title, description: description, body: body, focus_keyword: keyword });
      var color = scoreColor(seo.score);
      var label = scoreLabel(seo.score);

      return h('div', {
        style: {
          display: 'flex',
          gap: '24px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          padding: '20px',
          minHeight: '100vh',
          background: '#f9fafb'
        }
      },

        // ---- Article Preview ----
        h('div', { style: { flex: 2, background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }},
          title && h('h1', { style: { fontSize: '28px', fontWeight: 700, marginBottom: '8px', color: '#111' }}, title),
          description && h('p', { style: { color: '#6b7280', fontStyle: 'italic', marginBottom: '24px', borderLeft: '3px solid #e5e7eb', paddingLeft: '12px' }}, description),
          h('div', { style: { lineHeight: 1.7, color: '#374151' }, dangerouslySetInnerHTML: { __html: this.props.widgetFor('body') }})
        ),

        // ---- SEO Sidebar ----
        h('div', { style: { flex: '0 0 280px', position: 'sticky', top: '20px', alignSelf: 'flex-start' }},

          // Score Card
          h('div', {
            style: {
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
            }
          },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }},
              // Score circle
              h('div', {
                style: {
                  width: '56px', height: '56px',
                  borderRadius: '50%',
                  background: color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: '18px',
                  flexShrink: 0
                }
              }, seo.score),
              h('div', {},
                h('div', { style: { fontWeight: 600, fontSize: '14px', color: '#111' }}, 'SEO Score'),
                h('div', { style: { color: color, fontWeight: 600, fontSize: '13px' }}, label),
                h('div', { style: { color: '#9ca3af', fontSize: '11px' }}, seo.wordCount + ' words')
              )
            ),

            // Checks list
            h('div', { style: { fontSize: '12px' }},
              seo.checks.map(function (c, i) {
                return h('div', {
                  key: i,
                  style: {
                    display: 'flex', gap: '8px', marginBottom: '8px',
                    alignItems: 'flex-start',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    background: c.pass ? '#f0fdf4' : '#fef2f2'
                  }
                },
                  h('span', {
                    style: {
                      color: c.pass ? '#16a34a' : '#dc2626',
                      fontWeight: 700, flexShrink: 0, fontSize: '13px'
                    }
                  }, c.pass ? '✓' : '✗'),
                  h('span', { style: { color: c.pass ? '#166534' : '#991b1b', lineHeight: 1.4 }}, c.msg)
                );
              })
            )
          ),

          // Character counters
          h('div', {
            style: {
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '14px',
              marginBottom: '12px',
              fontSize: '12px'
            }
          },
            h('p', { style: { fontWeight: 600, color: '#111', marginBottom: '10px', fontSize: '13px' }}, 'Character Counts'),
            h('div', { style: { marginBottom: '8px' }},
              h('div', { style: { display: 'flex', justifyContent: 'space-between', color: '#6b7280', marginBottom: '3px' }},
                h('span', {}, 'Title'),
                h('span', { style: { color: (seo.titleLen >= 50 && seo.titleLen <= 60) ? '#16a34a' : '#d97706' }},
                  seo.titleLen + ' / 60'
                )
              ),
              h('div', { style: { background: '#e5e7eb', borderRadius: '4px', height: '4px' }},
                h('div', {
                  style: {
                    width: Math.min(100, (seo.titleLen / 60) * 100) + '%',
                    height: '100%',
                    borderRadius: '4px',
                    background: (seo.titleLen >= 50 && seo.titleLen <= 60) ? '#16a34a' : '#d97706',
                    transition: 'width 0.3s'
                  }
                })
              )
            ),
            h('div', {},
              h('div', { style: { display: 'flex', justifyContent: 'space-between', color: '#6b7280', marginBottom: '3px' }},
                h('span', {}, 'Meta description'),
                h('span', { style: { color: (seo.descLen >= 120 && seo.descLen <= 160) ? '#16a34a' : '#d97706' }},
                  seo.descLen + ' / 160'
                )
              ),
              h('div', { style: { background: '#e5e7eb', borderRadius: '4px', height: '4px' }},
                h('div', {
                  style: {
                    width: Math.min(100, (seo.descLen / 160) * 100) + '%',
                    height: '100%',
                    borderRadius: '4px',
                    background: (seo.descLen >= 120 && seo.descLen <= 160) ? '#16a34a' : '#d97706',
                    transition: 'width 0.3s'
                  }
                })
              )
            )
          ),

          // SERP Preview
          SerpPreview(title, description, keyword)
        )
      );
    }
  });

  // Register the preview for the blog collection
  window.CMS.registerPreviewTemplate('blog', BlogPreview);

})();

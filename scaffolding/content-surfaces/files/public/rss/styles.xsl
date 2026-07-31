<?xml version="1.0" encoding="UTF-8"?>
<!--
  Stylesheet for /rss.xml, so a human who clicks the feed link in a browser
  gets a readable page instead of a wall of raw XML. Feed readers ignore it.

  HEX LITERALS ARE UNAVOIDABLE HERE and this file is an explicit carve-out from
  the no-hex-in-markup rule, on the same grounds as <meta name="theme-color">:
  an XSL document is rendered standalone by the browser, outside the site's CSS,
  so it cannot read a brand token. The values below are the brand tokens
  transcribed by hand — if saboteur-styles changes them, change them here too.

    brand-black    #0a0a0a      fg-primary     #f5f4f0
    brand-surface  #111110      fg-secondary   #aaa8a4
    brand-rule     #1a1a18      fg-tertiary    #888680
    brand-red      #d44040

  Verified against brand/inputs/saboteur-base.css. Do not transcribe these from
  memory — check the file.

  Fonts are a system mono/sans stack, NOT @fontsource and NOT a web font: this
  document cannot import the site's self-hosted faces, and loading a font from
  a third-party host here would breach the cookieless posture.
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <title><xsl:value-of select="/rss/channel/title"/></title>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="noindex, follow"/>
        <style>
          body {
            background: #0a0a0a;
            color: #aaa8a4;
            font-family: ui-sans-serif, system-ui, sans-serif;
            line-height: 1.75;
            margin: 0;
            padding: 56px 24px;
          }
          .wrap { max-width: 68ch; margin: 0 auto; }
          .label {
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            font-size: 10px;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #888680;
          }
          h1 {
            color: #f5f4f0;
            font-size: 40px;
            letter-spacing: -0.03em;
            line-height: 1.1;
            margin: 16px 0 20px;
          }
          .note {
            border-left: 3px solid #d44040;
            padding-left: 18px;
            margin-bottom: 44px;
            color: #f5f4f0;
          }
          .note code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
          h2 { font-size: 19px; letter-spacing: -0.02em; margin: 0 0 6px; }
          a { color: #f5f4f0; text-decoration: underline; text-decoration-color: #d44040; text-underline-offset: 3px; }
          a:hover { color: #d44040; }
          li { border-top: 1px solid #1a1a18; padding: 18px 0; list-style: none; }
          ul { padding: 0; margin: 0; }
          p { margin: 0; font-size: 15px; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="label">RSS feed</div>
          <h1><xsl:value-of select="/rss/channel/title"/></h1>

          <div class="note">
            <p>This is a feed, not a page. Paste this URL into a feed reader to
            follow along. <a><xsl:attribute name="href"><xsl:value-of select="/rss/channel/link"/></xsl:attribute>Go to the site instead →</a></p>
          </div>

          <ul>
            <xsl:for-each select="/rss/channel/item">
              <li>
                <div class="label"><xsl:value-of select="pubDate"/></div>
                <h2>
                  <a>
                    <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
                    <xsl:value-of select="title"/>
                  </a>
                </h2>
                <p><xsl:value-of select="description"/></p>
              </li>
            </xsl:for-each>
          </ul>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>

// src/lib/propsToStyle.js

/** Convert element props to inline CSS style object */
export function propsToStyle(props = {}) {
  const style = {};

  if (props.fontSize)     style.fontSize     = `${props.fontSize}px`;
  if (props.fontWeight)   style.fontWeight   = props.fontWeight;
  if (props.fontFamily)   style.fontFamily   = props.fontFamily;
  if (props.color)        style.color        = props.color;
  if (props.textAlign)    style.textAlign    = props.textAlign;
  if (props.lineHeight)   style.lineHeight   = props.lineHeight;
  if (props.letterSpacing)style.letterSpacing= `${props.letterSpacing}px`;

  // Padding
  if (props.padTop    != null) style.paddingTop    = `${props.padTop}px`;
  if (props.padBottom != null) style.paddingBottom = `${props.padBottom}px`;
  if (props.padLeft   != null) style.paddingLeft   = `${props.padLeft}px`;
  if (props.padRight  != null) style.paddingRight  = `${props.padRight}px`;

  // Margin
  if (props.marginTop    != null) style.marginTop    = `${props.marginTop}px`;
  if (props.marginBottom != null) style.marginBottom = `${props.marginBottom}px`;

  // Width
  if (props.width)     style.width     = props.width;
  if (props.maxWidth)  style.maxWidth  = props.maxWidth;
  if (props.minWidth)  style.minWidth  = props.minWidth;

  // Height
  if (props.height)    style.height    = props.height;
  if (props.minHeight) style.minHeight = props.minHeight;

  // Background
  if (props.bg)        style.background = props.bg;
  if (props.bgGradient)style.background = props.bgGradient;

  // Border
  if (props.borderRadius)  style.borderRadius  = `${props.borderRadius}px`;
  if (props.borderColor)   style.borderColor   = props.borderColor;
  if (props.borderWidth)   style.borderWidth   = `${props.borderWidth}px`;
  if (props.borderStyle)   style.borderStyle   = props.borderStyle;

  return style;
}

/** Convert row/col settings to CSS */
export function rowBgStyle(s = {}) {
  const base = { transition: 'background 0.3s ease' };

  if (s.bgType === 'gradient')
    return {
      ...base,
      background: `linear-gradient(${s.gradientDir || '135deg'},${s.gradientFrom || '#6366f1'},${s.gradientTo || '#a855f7'})`,
    };

  if (s.bgType === 'image' && s.bgImage)
    return {
      ...base,
      backgroundImage: `url(${s.bgImage})`,
      backgroundSize:     s.bgSize     || 'cover',
      backgroundPosition: s.bgPosition || 'center',
      backgroundRepeat:   'no-repeat',
    };

  return { ...base, background: s.bg || '#ffffff' };
}

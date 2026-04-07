import type { CSSProperties, StyleValue } from 'vue';

// Re-export StyleValue type from Vue
export type { StyleValue };

// Create a record of CSS properties with undefined as default values
export type StyleValueRecord = Partial<CSSProperties>;

// List of all standard CSS properties
const cssPropertyKeys: (keyof CSSProperties)[] = [
  'alignContent', 'alignItems', 'alignSelf', 'all', 'animation', 'animationDelay',
  'animationDirection', 'animationDuration', 'animationFillMode', 'animationIterationCount',
  'animationName', 'animationPlayState', 'animationTimingFunction', 'appearance',
  'aspectRatio', 'backfaceVisibility', 'background', 'backgroundAttachment',
  'backgroundBlendMode', 'backgroundClip', 'backgroundColor', 'backgroundImage',
  'backgroundOrigin', 'backgroundPosition', 'backgroundPositionX', 'backgroundPositionY',
  'backgroundRepeat', 'backgroundSize', 'baselineShift', 'blockSize', 'border',
  'borderBlock', 'borderBlockColor', 'borderBlockEnd', 'borderBlockEndColor',
  'borderBlockEndStyle', 'borderBlockEndWidth', 'borderBlockStart', 'borderBlockStartColor',
  'borderBlockStartStyle', 'borderBlockStartWidth', 'borderBlockStyle', 'borderBlockWidth',
  'borderBottom', 'borderBottomColor', 'borderBottomLeftRadius', 'borderBottomRightRadius',
  'borderBottomStyle', 'borderBottomWidth', 'borderCollapse', 'borderColor',
  'borderEndEndRadius', 'borderEndStartRadius', 'borderImage', 'borderImageOutset',
  'borderImageRepeat', 'borderImageSlice', 'borderImageSource', 'borderImageWidth',
  'borderInline', 'borderInlineColor', 'borderInlineEnd', 'borderInlineEndColor',
  'borderInlineEndStyle', 'borderInlineEndWidth', 'borderInlineStart', 'borderInlineStartColor',
  'borderInlineStartStyle', 'borderInlineStartWidth', 'borderInlineStyle', 'borderInlineWidth',
  'borderLeft', 'borderLeftColor', 'borderLeftStyle', 'borderLeftWidth', 'borderRadius',
  'borderRight', 'borderRightColor', 'borderRightStyle', 'borderRightWidth', 'borderSpacing',
  'borderStartEndRadius', 'borderStartStartRadius', 'borderStyle', 'borderTop',
  'borderTopColor', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderTopStyle',
  'borderTopWidth', 'borderWidth', 'bottom', 'boxDecorationBreak', 'boxShadow',
  'boxSizing', 'breakAfter', 'breakBefore', 'breakInside', 'captionSide',
  'caretColor', 'clear', 'clip', 'clipPath', 'clipRule', 'color',
  'colorInterpolation', 'colorInterpolationFilters', 'colorScheme', 'columnCount',
  'columnFill', 'columnGap', 'columnRule', 'columnRuleColor', 'columnRuleStyle',
  'columnRuleWidth', 'columnSpan', 'columnWidth', 'columns', 'contain',
  'content', 'counterIncrement', 'counterReset', 'counterSet', 'cursor',
  'direction', 'display', 'dominantBaseline', 'emptyCells', 'fill',
  'fillOpacity', 'fillRule', 'filter', 'flex', 'flexBasis',
  'flexDirection', 'flexFlow', 'flexGrow', 'flexShrink', 'flexWrap',
  'float', 'floodColor', 'floodOpacity', 'font', 'fontFamily',
  'fontFeatureSettings', 'fontKerning', 'fontOpticalSizing', 'fontSize',
  'fontSizeAdjust', 'fontStretch', 'fontStyle', 'fontSynthesis', 'fontVariant',
  'fontVariantCaps', 'fontVariantEastAsian', 'fontVariantLigatures', 'fontVariantNumeric',
  'fontVariantPosition', 'fontVariationSettings', 'fontWeight', 'gap', 'grid',
  'gridArea', 'gridAutoColumns', 'gridAutoFlow', 'gridAutoRows', 'gridColumn',
  'gridColumnEnd', 'gridColumnGap', 'gridColumnStart', 'gridGap', 'gridRow',
  'gridRowEnd', 'gridRowGap', 'gridRowStart', 'gridTemplate', 'gridTemplateAreas',
  'gridTemplateColumns', 'gridTemplateRows', 'hangingPunctuation', 'height',
  'hyphens', 'imageOrientation', 'imageRendering', 'inlineSize', 'inset',
  'insetBlock', 'insetBlockEnd', 'insetBlockStart', 'insetInline', 'insetInlineEnd',
  'insetInlineStart', 'isolation', 'justifyContent', 'justifyItems', 'justifySelf',
  'left', 'letterSpacing', 'lightingColor', 'lineBreak', 'lineHeight',
  'listStyle', 'listStyleImage', 'listStylePosition', 'listStyleType', 'margin',
  'marginBlock', 'marginBlockEnd', 'marginBlockStart', 'marginBottom', 'marginInline',
  'marginInlineEnd', 'marginInlineStart', 'marginLeft', 'marginRight', 'marginTop',
  'marker', 'markerEnd', 'markerMid', 'markerStart', 'mask',
  'maskClip', 'maskComposite', 'maskImage', 'maskMode', 'maskOrigin',
  'maskPosition', 'maskRepeat', 'maskSize', 'maskType', 'maxBlockSize',
  'maxHeight', 'maxInlineSize', 'maxWidth', 'minBlockSize', 'minHeight',
  'minInlineSize', 'minWidth', 'mixBlendMode', 'objectFit', 'objectPosition',
  'offset', 'offsetAnchor', 'offsetDistance', 'offsetPath', 'offsetRotate',
  'opacity', 'order', 'orphans', 'outline', 'outlineColor',
  'outlineOffset', 'outlineStyle', 'outlineWidth', 'overflow', 'overflowAnchor',
  'overflowWrap', 'overflowX', 'overflowY', 'overscrollBehavior', 'overscrollBehaviorBlock',
  'overscrollBehaviorInline', 'overscrollBehaviorX', 'overscrollBehaviorY', 'padding',
  'paddingBlock', 'paddingBlockEnd', 'paddingBlockStart', 'paddingBottom', 'paddingInline',
  'paddingInlineEnd', 'paddingInlineStart', 'paddingLeft', 'paddingRight', 'paddingTop',
  'pageBreakAfter', 'pageBreakBefore', 'pageBreakInside', 'paintOrder', 'perspective',
  'perspectiveOrigin', 'placeContent', 'placeItems', 'placeSelf', 'pointerEvents',
  'position', 'quotes', 'resize', 'right', 'rotate',
  'rowGap', 'rubyPosition', 'scale', 'scrollBehavior', 'scrollMargin',
  'scrollMarginBlock', 'scrollMarginBlockEnd', 'scrollMarginBlockStart', 'scrollMarginBottom',
  'scrollMarginInline', 'scrollMarginInlineEnd', 'scrollMarginInlineStart', 'scrollMarginLeft',
  'scrollMarginRight', 'scrollMarginTop', 'scrollPadding', 'scrollPaddingBlock',
  'scrollPaddingBlockEnd', 'scrollPaddingBlockStart', 'scrollPaddingBottom', 'scrollPaddingInline',
  'scrollPaddingInlineEnd', 'scrollPaddingInlineStart', 'scrollPaddingLeft', 'scrollPaddingRight',
  'scrollPaddingTop', 'scrollSnapAlign', 'scrollSnapStop', 'scrollSnapType', 'scrollbarColor',
  'scrollbarGutter', 'scrollbarWidth', 'shapeImageThreshold', 'shapeMargin', 'shapeOutside',
  'shapeRendering', 'stopColor', 'stopOpacity', 'stroke', 'strokeDasharray',
  'strokeDashoffset', 'strokeLinecap', 'strokeLinejoin', 'strokeMiterlimit', 'strokeOpacity',
  'strokeWidth', 'tabSize', 'tableLayout', 'textAlign', 'textAlignLast',
  'textAnchor', 'textCombineUpright', 'textDecoration', 'textDecorationColor', 'textDecorationLine',
  'textDecorationSkipInk', 'textDecorationStyle', 'textDecorationThickness', 'textEmphasis',
  'textEmphasisColor', 'textEmphasisPosition', 'textEmphasisStyle', 'textIndent', 'textJustify',
  'textOrientation', 'textOverflow', 'textRendering', 'textShadow', 'textTransform',
  'textUnderlineOffset', 'textUnderlinePosition', 'top', 'touchAction', 'transform',
  'transformBox', 'transformOrigin', 'transformStyle', 'transition', 'transitionDelay',
  'transitionDuration', 'transitionProperty', 'transitionTimingFunction', 'translate',
  'unicodeBidi', 'userSelect', 'verticalAlign', 'visibility', 'whiteSpace',
  'widows', 'width', 'willChange', 'wordBreak', 'wordSpacing',
  'wordWrap', 'writingMode', 'zIndex',

];

// Common vendor-prefixed CSS properties
const vendorPrefixedProperties: string[] = [
  // WebKit (Chrome, Safari, newer Edge)
  'WebkitAppearance', 'WebkitBackfaceVisibility', 'WebkitBackgroundClip', 'WebkitBackgroundOrigin',
  'WebkitBackgroundSize', 'WebkitBorderImage', 'WebkitBorderRadius', 'WebkitBoxShadow',
  'WebkitBoxSizing', 'WebkitFilter', 'WebkitFlex', 'WebkitFlexBasis', 'WebkitFlexDirection',
  'WebkitFlexFlow', 'WebkitFlexGrow', 'WebkitFlexShrink', 'WebkitFlexWrap', 'WebkitFontSmoothing',
  'WebkitLineClamp', 'WebkitMask', 'WebkitMaskClip', 'WebkitMaskComposite', 'WebkitMaskImage',
  'WebkitMaskOrigin', 'WebkitMaskPosition', 'WebkitMaskRepeat', 'WebkitMaskSize',
  'WebkitPerspective', 'WebkitPerspectiveOrigin', 'WebkitTapHighlightColor', 'WebkitTextFillColor',
  'WebkitTextStroke', 'WebkitTextStrokeColor', 'WebkitTextStrokeWidth', 'WebkitTransform',
  'WebkitTransformOrigin', 'WebkitTransformStyle', 'WebkitTransition', 'WebkitTransitionDelay',
  'WebkitTransitionDuration', 'WebkitTransitionProperty', 'WebkitTransitionTimingFunction',
  'WebkitUserSelect',

  // Mozilla (Firefox)
  'MozAppearance', 'MozBackfaceVisibility', 'MozBinding', 'MozBorderRadius', 'MozBoxShadow',
  'MozBoxSizing', 'MozColumnCount', 'MozColumnFill', 'MozColumnGap', 'MozColumnRule',
  'MozColumnRuleColor', 'MozColumnRuleStyle', 'MozColumnRuleWidth', 'MozColumnWidth', 'MozColumns',
  'MozFontFeatureSettings', 'MozHyphens', 'MozOsxFontSmoothing', 'MozPerspective',
  'MozPerspectiveOrigin', 'MozTabSize', 'MozTextAlignLast', 'MozTransform', 'MozTransformOrigin',
  'MozTransformStyle', 'MozTransition', 'MozTransitionDelay', 'MozTransitionDuration',
  'MozTransitionProperty', 'MozTransitionTimingFunction', 'MozUserSelect', 'MozWindowDragging',

  // Microsoft (Internet Explorer, old Edge)
  'msContentZoomChaining', 'msContentZooming', 'msContentZoomLimit', 'msContentZoomLimitMax',
  'msContentZoomLimitMin', 'msContentZoomSnap', 'msContentZoomSnapPoints', 'msContentZoomSnapType',
  'msFilter', 'msFlex', 'msFlexBasis', 'msFlexDirection', 'msFlexFlow', 'msFlexGrow',
  'msFlexShrink', 'msFlexWrap', 'msFlowFrom', 'msFlowInto', 'msGridColumn', 'msGridColumnAlign',
  'msGridColumnSpan', 'msGridColumns', 'msGridRow', 'msGridRowAlign', 'msGridRowSpan', 'msGridRows',
  'msHighContrastAdjust', 'msHyphenateLimitChars', 'msHyphenateLimitLines', 'msHyphenateLimitZone',
  'msHyphens', 'msImeAlign', 'msOverflowStyle', 'msScrollChaining', 'msScrollLimit',
  'msScrollLimitXMax', 'msScrollLimitXMin', 'msScrollLimitYMax', 'msScrollLimitYMin',
  'msScrollRails', 'msScrollSnapPointsX', 'msScrollSnapPointsY', 'msScrollSnapType',
  'msScrollSnapX', 'msScrollSnapY', 'msScrollTranslation', 'msTextCombineHorizontal',
  'msTextSizeAdjust', 'msTouchAction', 'msTouchSelect', 'msTransform', 'msTransformOrigin',
  'msTransition', 'msTransitionDelay', 'msTransitionDuration', 'msTransitionProperty',
  'msTransitionTimingFunction', 'msUserSelect', 'msWrapFlow', 'msWrapMargin', 'msWrapThrough',

  // Opera
  'OAnimation', 'OAnimationDelay', 'OAnimationDirection', 'OAnimationDuration',
  'OAnimationFillMode', 'OAnimationIterationCount', 'OAnimationName', 'OAnimationPlayState',
  'OAnimationTimingFunction', 'OTransform', 'OTransformOrigin', 'OTransition', 'OTransitionDelay',
  'OTransitionDuration', 'OTransitionProperty', 'OTransitionTimingFunction',
];

// Runtime object with all CSS properties initialized to undefined
export const cssPropertiesObject = cssPropertyKeys.reduce((acc, key) => {
  acc[key] = undefined;
  return acc;
}, {} as Record<string, undefined>);

// Add vendor-prefixed properties
vendorPrefixedProperties.forEach((key) => {
  cssPropertiesObject[key] = undefined;
});

// Proxy version for dynamic access (returns undefined for any property)
export const cssPropertiesDefault = new Proxy(cssPropertiesObject, {
  get(target, prop) {
    return undefined;
  },
  has() {
    return true;
  },
});

// Helper to create a style object with specific properties set to undefined
export const createStyleObject = <T extends keyof CSSProperties>(
  ...keys: T[]
): Record<T, undefined> => {
  return keys.reduce((acc, key) => {
    acc[key] = undefined;
    return acc;
  }, {} as Record<T, undefined>);
};

export const NO_RENDER = { render: false };
export const SYNC_RENDER = { renderSync: true };
export const DOM_RENDER = { build: true };

// is this a DOM environment
export const HAS_DOM = typeof document!=='undefined';
export const TEXT_CONTENT = !HAS_DOM || 'textContent' in document ? 'textContent' : 'nodeValue';

export const UNDEFINED_ELEMENT = 'undefined';

// DOM properties that should NOT have "px" added when numeric
export const NON_DIMENSION_PROPS = {
  boxFlex: 1, boxFlexGroup: 1, columnCount: 1, fillOpacity: 1, flex: 1, flexGrow: 1,
  flexPositive: 1, flexShrink: 1, flexNegative: 1, fontWeight: 1, lineClamp: 1, lineHeight: 1,
  opacity: 1, order: 1, orphans: 1, strokeOpacity: 1, widows: 1, zIndex: 1, zoom: 1,
}

export const EMPTY = {}
export const EMPTY_BASE = ''

export const ATTR_KEY = typeof Symbol !== 'undefined' ? Symbol('Satiumattr') : '__satiumattr__'


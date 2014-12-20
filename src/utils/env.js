'use strict';

module.exports = {
  CLIENT: typeof window != 'undefined',
  SERVER: typeof window == 'undefined'
}
import React, {
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

import * as DS from '../index';

export const playgroundScope = {
  React,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useId,
  useReducer,
  useContext,
  useLayoutEffect,
  ...DS,
};

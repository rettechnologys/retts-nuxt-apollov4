import { capitalCaseStr } from '~/utils/helpers/String';
import type { VNode } from 'vue';
import { h } from 'vue';

interface Props extends Record<string, any> {
  [key: string]: any;
}
/**
 * @function componentRenderer
 * @description
 * A function that takes a component and props as arguments and returns a VueElement.
 * This function is used to dynamically render a component with the given props.
 * @param {VNode | HTMLElement | undefined } component - The component to render.
 * @param {Props} props - The props to pass to the component.
 * @example
 * use helper function to render a component `componentRenderer`
 *  ```
 * const vueElement = componentRenderer(component, props);
 *  ```
 * @returns {VNode} A VueElement of the rendered component.
 */
export const componentRenderer = (
  component: VNode | HTMLElement | any | undefined,
  props: Props,
) => {
  if (!component) return null;

  // const actions = Object.keys(props.on || {}).map((key) => {
  //   return {
  //     [`on${capitalCaseStr(key)}`]: props.on[key],
  //   };
  // });

  // console.log('actions', actions);
  const actions = Object.keys(props.on || {}).reduce((acc, key) => {
    return {
      ...acc,
      [`on${capitalCaseStr(key)}`]: props.on[key],
    };
  }, {});

  return h(component, {
    data: props.data,
    ...props,
    ...actions,
  });
};

import hasRole from './hasRole'
import hasPermi from './hasPermi'
import copyText from './copyText'
import loading from './loading'
import animation from './animation'
import wheelHorizontal from './wheelHorizontal'
import debounce from './debounce'
import throttle from './throttle'
import disabled from './disabled'
export default function directive(app) {
  app.directive('hasRole', hasRole)
  app.directive('hasPermi', hasPermi)
  app.directive('copyText', copyText)
  app.directive('load', loading)
  app.directive('animation', animation)
  app.directive('wheel-h', wheelHorizontal)
  app.directive('debounce', debounce)
  app.directive('throttle', throttle)
  app.directive('disabled', disabled)
}
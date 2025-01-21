import hasRole from './hasRole'
import hasPermi from './hasPermi'
import copyText from './copyText'
import loading from './loading'
import animation from './animation'
export default function directive(app) {
  app.directive('hasRole', hasRole)
  app.directive('hasPermi', hasPermi)
  app.directive('copyText', copyText)
  app.directive('loading-c', loading)
  app.directive('animation', animation)
}
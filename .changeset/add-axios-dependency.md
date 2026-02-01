---
'@openzeppelin/defender-sdk-base-client': patch
---

fix: add axios as an explicit dependency

The base-client package imports axios in its code but did not declare it as a dependency. This caused "Cannot find module 'axios'" errors in fresh installations where npm's dependency hoisting did not provide axios from sibling packages. This fix ensures the package works correctly when installed standalone.

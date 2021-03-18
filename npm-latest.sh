#! /bin/bash

export EXE1="npm i --save-dev"
export ARGS11="eslint@latest eslint-config-airbnb@latest eslint-config-prettier@latest"
export ARGS12="eslint-plugin-import@latest eslint-plugin-jsx-a11y@latest eslint-plugin-react@latest"
export ARGS13="eslint-plugin-react-hooks@latest qunit@latest rollup@latest rollup-plugin-terser@latest"
export ARGS1="${ARGS11} ${ARGS12} ${ARGS13}"

export EXE2="npm i"
export ARGS21="prop-types@latest ramda@latest react@latest react-dom@latest"
export ARGS22="react-dom-factories@latest react-redux@latest reactable@latest redux@latest"
export ARGS23="seamless-immutable@latest"
export ARGS2="${ARGS21} ${ARGS22} ${ARGS23}"

${EXE1} ${ARGS1}
${EXE2} ${ARGS2}

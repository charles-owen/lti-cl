(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["LtiConsole"] = factory();
	else
		root["LtiConsole"] = factory();
})(window, function() {
return (window["webpackJsonp_name_"] = window["webpackJsonp_name_"] || []).push([["LtiConsole"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./vendor/cl/course/js/Util/MemberSelectorVue.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--2!./node_modules/vue-loader/lib??vue-loader-options!./vendor/cl/course/js/Util/MemberSelectorVue.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var LIMIT = 20;
/* harmony default export */ __webpack_exports__["default"] = ({
  props: ['selected'],
  data: function data() {
    return {
      query: '',
      result: [],
      noresult: false,
      seq: 1,
      fetched: false,
      timer: null,
      set: false,
      more: false,
      searcher: Site.root + '/vendor/cl/site/img/search.png',
      deleter: Site.root + '/vendor/cl/site/img/x.png'
    };
  },
  watch: {
    query: function query(after, before) {
      var _this = this;

      if (this.set) {
        this.set = false;
        return;
      }

      if (this.timer !== null) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      ;
      this.timer = setTimeout(function () {
        _this.fetch(after);
      }, 300);
    }
  },
  methods: {
    fetch: function fetch(query) {
      var _this2 = this;

      console.log('fetch');
      console.log(query);

      if (this.timer !== null) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      ;
      this.selected(null);
      query = query.trim();

      if (query.length < 2) {
        this.fetched = false;
        this.result = [];
        return;
      }

      this.seq++;
      var member = this.$store.state.user.user.member;
      var params = {
        search: query,
        seq: this.seq,
        limit: LIMIT,
        semester: member.semester,
        section: member.section
      };
      Site.api.get('/api/course/members', params).then(function (response) {
        if (!response.hasError()) {
          // This protects from out-of-order processing
          // of results from the server...
          var seq = response.getData('seq');

          if (+seq.id !== _this2.seq) {
            return;
          }

          var data = response.getData('users');

          if (data !== null) {
            _this2.result = [];
            _this2.more = false;
            data.attributes.forEach(function (userData) {
              if (userData.more !== 'yes') {
                var user = new Users.User(userData);

                _this2.result.push(user);
              } else {
                _this2.more = true;
              }
            });
            _this2.noresult = _this2.result.length === 0;
          }
        } else {
          Site.toast(_this2, response);
        }
      }).catch(function (error) {
        console.log(error);
        Site.toast(_this2, error);
      });
    },
    selectUser: function selectUser(user) {
      ;
      this.query = user.name;
      this.set = true;
      this.result = [];
      this.noresult = false;
      this.more = false;
      this.selected(user);
    },
    clear: function clear() {
      this.seq++; // Just in case

      this.result = [];
      this.noresult = false;
      this.more = false;
      this.query = '';
      this.selected(null);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./vendor/cl/lti/js/Console/LtiComponent.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--2!./node_modules/vue-loader/lib??vue-loader-options!./vendor/cl/lti/js/Console/LtiComponent.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var course_cl_js_MemberSelectorVue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! course-cl/js/MemberSelectorVue */ "./vendor/cl/course/js/MemberSelectorVue.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      selectedAssignment: 'any',
      selectedGrade: 'any',
      user: null,
      assignTags: [],
      gradeTags: [],
      toView: Site.root + '/cl/lti/view',
      toDownload: Site.root + '/cl/lti/download',
      toDownloadImg: Site.root + '/vendor/cl/site/img/download.png',
      toViewImg: Site.root + '/vendor/cl/site/img/eye16.png',
      fetched: false,
      results: []
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$parent.setTitle(': LTI Auditing');
    Site.api.get('/api/lti/items', {}).then(function (response) {
      if (!response.hasError()) {
        var data = response.getData('assigntags');

        if (data !== null) {
          _this.assignTags = data.attributes;
        }

        data = response.getData('gradeTags');

        if (data !== null) {
          _this.gradeTags = data.attributes;
        }
      } else {
        Site.toast(_this, response);
      }
    }).catch(function (error) {
      console.log(error);
      Site.toast(_this, error);
    });
  },
  components: {
    'user-selector': course_cl_js_MemberSelectorVue__WEBPACK_IMPORTED_MODULE_0__["MemberSelectorVue"]
  },
  methods: {
    selected: function selected(user) {
      this.user = user;
    },
    query: function query() {
      var _this2 = this;

      if (this.user === null) {
        return;
      }

      this.fetched = false;
      var params = {
        'memberId': this.user.member.id
      };

      if (this.selectedAssignment !== 'any') {
        params.assignTag = this.selectedAssignment;
      }

      if (this.selectedGrade !== 'any') {
        if (this.selectedGrade === 'none') {
          params.gradeTag = '';
        } else {
          params.gradeTag = this.selectedGrade;
        }
      }

      Site.api.get('/api/lti', params).then(function (response) {
        if (!response.hasError()) {
          _this2.fetched = true;
          var data = response.getData('outcomes');

          if (data !== null) {
            console.log(data.attributes);
            _this2.results = data.attributes;
          }
        } else {
          Site.toast(_this2, response);
        }
      }).catch(function (error) {
        console.log(error);
        Site.toast(_this2, error);
      });
    },
    path: function path(result) {
      var assignTag = result.assignTag !== '' ? result.assignTag : '-';
      var gradeTag = result.gradeTag !== '' ? result.gradeTag : '-';
      return '/' + result.user.member.id + '/' + assignTag + '/' + gradeTag;
    }
  }
});

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib/index.js?!./vendor/cl/course/js/Util/MemberSelectorVue.vue?vue&type=style&index=0&id=52fd31c2&lang=scss&scoped=true&":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib??vue-loader-options!./vendor/cl/course/js/Util/MemberSelectorVue.vue?vue&type=style&index=0&id=52fd31c2&lang=scss&scoped=true& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "a.searcher[data-v-52fd31c2] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  height: 100%;\n  min-height: 100%;\n  width: 21px;\n  text-align: center;\n  background: #aaaaaa;\n}\na.searcher img[data-v-52fd31c2] {\n  height: 16px;\n  width: 16px;\n  vertical-align: -4px;\n}\ndiv.cl-input[data-v-52fd31c2] {\n  display: inline-block;\n  position: relative;\n  width: 300px;\n}\ndiv.cl-input input[data-v-52fd31c2] {\n  width: 100%;\n  border: 1px solid #cccccc;\n}\ndiv.cl-input div.cl-results[data-v-52fd31c2] {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 100%;\n  overflow: hidden;\n  font-size: 0.85em;\n  background: white;\n  border-left: 1px solid black;\n  border-right: 1px solid black;\n  border-bottom: 1px solid black;\n}\ndiv.cl-input div.cl-results div.cl-result-list[data-v-52fd31c2] {\n  display: table;\n  width: 100%;\n}\ndiv.cl-input div.cl-results div.cl-result-list div[data-v-52fd31c2] {\n  display: table-row;\n  border-bottom: 1px solid #888888;\n  cursor: pointer;\n}\ndiv.cl-input div.cl-results div.cl-result-list div span[data-v-52fd31c2] {\n  display: table-cell;\n  white-space: nowrap;\n  text-align: left;\n  padding: 0.5em 0.25em;\n}\ndiv.cl-input div.cl-results div.cl-result-list div span a[data-v-52fd31c2] {\n  text-decoration: none;\n  color: black;\n}\ndiv.cl-input div.cl-results div.cl-result-list div span a[data-v-52fd31c2]:hover {\n  color: #888888;\n}\ndiv.cl-input div.cl-results div.cl-result-list div span[data-v-52fd31c2]:first-child {\n  font-style: italic;\n}\ndiv.cl-input div.cl-results div.cl-result-list div span[data-v-52fd31c2]:last-child {\n  overflow: hidden;\n  width: 99%;\n}\ndiv.cl-input div.cl-results div.cl-result-list div:first-child span[data-v-52fd31c2],\ndiv.cl-input div.cl-results div.cl-result-list div:last-child span[data-v-52fd31c2] {\n  padding: 0.25em 0.25em;\n}\ndiv.cl-input div.cl-results div.statement[data-v-52fd31c2] {\n  width: 100%;\n  text-align: center;\n  font-style: italic;\n}\n\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib/index.js?!./vendor/cl/lti/js/Console/LtiComponent.vue?vue&type=style&index=0&lang=scss&":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib??vue-loader-options!./vendor/cl/lti/js/Console/LtiComponent.vue?vue&type=style&index=0&lang=scss& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "div.cl-lti-console label span:first-child {\n  display: inline-block;\n  width: 10em;\n  text-align: right;\n  padding: 0 0.25em 0 0;\n}\ndiv.cl-lti-console input[type=text],\ndiv.cl-lti-console option {\n  padding: 1px 0.25em;\n}\ndiv.cl-lti-console select {\n  min-width: 15em;\n}\ndiv.cl-lti-console button:disabled {\n  color: gray;\n}\n\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./vendor/cl/course/js/Util/MemberSelectorVue.vue?vue&type=template&id=52fd31c2&scoped=true&":
/*!*********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./vendor/cl/course/js/Util/MemberSelectorVue.vue?vue&type=template&id=52fd31c2&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("span", [
    _c("div", { staticClass: "cl-input" }, [
      _c("input", {
        directives: [
          {
            name: "model",
            rawName: "v-model",
            value: _vm.query,
            expression: "query"
          }
        ],
        attrs: { type: "text", maxlength: "150" },
        domProps: { value: _vm.query },
        on: {
          input: function($event) {
            if ($event.target.composing) {
              return
            }
            _vm.query = $event.target.value
          }
        }
      }),
      _vm._v(" "),
      _c(
        "a",
        {
          staticClass: "searcher",
          on: {
            click: function($event) {
              $event.preventDefault()
              _vm.fetch(_vm.query)
            }
          }
        },
        [_c("img", { attrs: { src: _vm.searcher } })]
      ),
      _vm._v(" "),
      _vm.result.length > 0 || _vm.noresult
        ? _c("div", { staticClass: "cl-results" }, [
            _c(
              "div",
              { staticClass: "cl-result-list" },
              _vm._l(_vm.result, function(user) {
                return _c(
                  "div",
                  {
                    on: {
                      click: function($event) {
                        $event.preventDefault()
                        _vm.selectUser(user)
                      }
                    }
                  },
                  [
                    _c("span", [
                      _c(
                        "a",
                        {
                          on: {
                            click: function($event) {
                              $event.preventDefault()
                              _vm.selectUser(user)
                            }
                          }
                        },
                        [_vm._v(_vm._s(user.userId))]
                      )
                    ]),
                    _vm._v(" "),
                    _c("span", [
                      _c(
                        "a",
                        {
                          on: {
                            click: function($event) {
                              $event.preventDefault()
                              _vm.selectUser(user)
                            }
                          }
                        },
                        [_vm._v(_vm._s(user.name))]
                      )
                    ])
                  ]
                )
              }),
              0
            ),
            _vm._v(" "),
            _vm.noresult
              ? _c("div", { staticClass: "statement" }, [
                  _vm._v("No results...")
                ])
              : _vm._e(),
            _vm._v(" "),
            _vm.more
              ? _c("div", { staticClass: "statement" }, [_vm._v("...more...")])
              : _vm._e()
          ])
        : _vm._e()
    ]),
    _vm._v(" "),
    _c(
      "a",
      {
        on: {
          click: function($event) {
            $event.preventDefault()
            return _vm.clear($event)
          }
        }
      },
      [_c("img", { attrs: { src: _vm.deleter } })]
    )
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./vendor/cl/lti/js/Console/LtiComponent.vue?vue&type=template&id=68399a62&":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./vendor/cl/lti/js/Console/LtiComponent.vue?vue&type=template&id=68399a62& ***!
  \****************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "content cl-lti-console" }, [
    _c("div", { staticClass: "full" }, [
      _c("p", [
        _c("label", [
          _c("span", [_vm._v("Assignment: ")]),
          _c(
            "select",
            {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.selectedAssignment,
                  expression: "selectedAssignment"
                }
              ],
              on: {
                change: function($event) {
                  var $$selectedVal = Array.prototype.filter
                    .call($event.target.options, function(o) {
                      return o.selected
                    })
                    .map(function(o) {
                      var val = "_value" in o ? o._value : o.value
                      return val
                    })
                  _vm.selectedAssignment = $event.target.multiple
                    ? $$selectedVal
                    : $$selectedVal[0]
                }
              }
            },
            [
              _c("option", [_vm._v("any")]),
              _vm._v(" "),
              _vm._l(_vm.assignTags, function(app) {
                return _c("option", [_vm._v(_vm._s(app))])
              })
            ],
            2
          )
        ])
      ]),
      _vm._v(" "),
      _c("p", [
        _c("label", [
          _c("span", [_vm._v("Grade item: ")]),
          _c(
            "select",
            {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.selectedGrade,
                  expression: "selectedGrade"
                }
              ],
              on: {
                change: function($event) {
                  var $$selectedVal = Array.prototype.filter
                    .call($event.target.options, function(o) {
                      return o.selected
                    })
                    .map(function(o) {
                      var val = "_value" in o ? o._value : o.value
                      return val
                    })
                  _vm.selectedGrade = $event.target.multiple
                    ? $$selectedVal
                    : $$selectedVal[0]
                }
              }
            },
            [
              _c("option", [_vm._v("any")]),
              _vm._v(" "),
              _c("option", [_vm._v("none")]),
              _vm._v(" "),
              _vm._l(_vm.gradeTags, function(app) {
                return _c("option", [_vm._v(_vm._s(app))])
              })
            ],
            2
          )
        ])
      ]),
      _vm._v(" "),
      _c("p", [
        _c(
          "label",
          [
            _c("span", [_vm._v("Member: ")]),
            _c("user-selector", { attrs: { selected: _vm.selected } })
          ],
          1
        )
      ]),
      _vm._v(" "),
      _c("p", { staticClass: "center" }, [
        _c(
          "button",
          {
            attrs: { disabled: _vm.user === null },
            on: {
              click: function($event) {
                $event.preventDefault()
                _vm.query()
              }
            }
          },
          [_vm._v("Query")]
        )
      ]),
      _vm._v(" "),
      _vm.fetched
        ? _c("div", [
            _vm.results.length > 0
              ? _c(
                  "table",
                  { staticClass: "small" },
                  [
                    _vm._m(0),
                    _vm._v(" "),
                    _vm._l(_vm.results, function(result) {
                      return _c("tr", [
                        _c(
                          "td",
                          {
                            class: result.user.user.length > 10 ? "small" : ""
                          },
                          [_vm._v(_vm._s(result.user.user))]
                        ),
                        _vm._v(" "),
                        _c("td", [_vm._v(_vm._s(result.user.name))]),
                        _vm._v(" "),
                        _c("td", [_vm._v(_vm._s(result.assignTag))]),
                        _vm._v(" "),
                        _c("td", [_vm._v(_vm._s(result.gradeTag))]),
                        _vm._v(" "),
                        _c("td", [
                          _c(
                            "a",
                            {
                              attrs: {
                                href: _vm.toView + _vm.path(result),
                                target: "_file"
                              }
                            },
                            [_c("img", { attrs: { src: _vm.toViewImg } })]
                          ),
                          _vm._v(" "),
                          _c(
                            "a",
                            {
                              attrs: { href: _vm.toDownload + _vm.path(result) }
                            },
                            [_c("img", { attrs: { src: _vm.toDownloadImg } })]
                          )
                        ]),
                        _vm._v(" "),
                        _c("td", { staticClass: "small" }, [
                          _vm._v(_vm._s(result.createdStr))
                        ]),
                        _vm._v(" "),
                        _c("td", { staticClass: "small" }, [
                          _vm._v(_vm._s(result.modifiedStr))
                        ])
                      ])
                    })
                  ],
                  2
                )
              : _vm._e(),
            _vm._v(" "),
            _vm.results.length === 0
              ? _c("p", { staticClass: "centerbox secondb center" }, [
                  _vm._v("No files...")
                ])
              : _vm._e()
          ])
        : _vm._e()
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("tr", [
      _c("th", [_vm._v("User")]),
      _vm._v(" "),
      _c("th", [_vm._v("Name")]),
      _vm._v(" "),
      _c("th", [_vm._v("Assign")]),
      _vm._v(" "),
      _c("th", [_vm._v("Item")]),
      _vm._v(" "),
      _c("th", [_vm._v("File")]),
      _vm._v(" "),
      _c("th", [_vm._v("Created")]),
      _vm._v(" "),
      _c("th", [_vm._v("Modified")])
    ])
  }
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib/index.js?!./vendor/cl/course/js/Util/MemberSelectorVue.vue?vue&type=style&index=0&id=52fd31c2&lang=scss&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib??vue-loader-options!./vendor/cl/course/js/Util/MemberSelectorVue.vue?vue&type=style&index=0&id=52fd31c2&lang=scss&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../../../node_modules/css-loader!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/resolve-url-loader!../../../../../node_modules/sass-loader/lib/loader.js?sourceMap!../../../../../node_modules/vue-loader/lib??vue-loader-options!./MemberSelectorVue.vue?vue&type=style&index=0&id=52fd31c2&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib/index.js?!./vendor/cl/course/js/Util/MemberSelectorVue.vue?vue&type=style&index=0&id=52fd31c2&lang=scss&scoped=true&");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../../../../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("a17d7054", content, false, {});
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(/*! !../../../../../node_modules/css-loader!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/resolve-url-loader!../../../../../node_modules/sass-loader/lib/loader.js?sourceMap!../../../../../node_modules/vue-loader/lib??vue-loader-options!./MemberSelectorVue.vue?vue&type=style&index=0&id=52fd31c2&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib/index.js?!./vendor/cl/course/js/Util/MemberSelectorVue.vue?vue&type=style&index=0&id=52fd31c2&lang=scss&scoped=true&", function() {
     var newContent = __webpack_require__(/*! !../../../../../node_modules/css-loader!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/resolve-url-loader!../../../../../node_modules/sass-loader/lib/loader.js?sourceMap!../../../../../node_modules/vue-loader/lib??vue-loader-options!./MemberSelectorVue.vue?vue&type=style&index=0&id=52fd31c2&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib/index.js?!./vendor/cl/course/js/Util/MemberSelectorVue.vue?vue&type=style&index=0&id=52fd31c2&lang=scss&scoped=true&");
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib/index.js?!./vendor/cl/lti/js/Console/LtiComponent.vue?vue&type=style&index=0&lang=scss&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib??vue-loader-options!./vendor/cl/lti/js/Console/LtiComponent.vue?vue&type=style&index=0&lang=scss& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../../../node_modules/css-loader!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/resolve-url-loader!../../../../../node_modules/sass-loader/lib/loader.js?sourceMap!../../../../../node_modules/vue-loader/lib??vue-loader-options!./LtiComponent.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib/index.js?!./vendor/cl/lti/js/Console/LtiComponent.vue?vue&type=style&index=0&lang=scss&");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../../../../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("a19333e0", content, false, {});
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(/*! !../../../../../node_modules/css-loader!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/resolve-url-loader!../../../../../node_modules/sass-loader/lib/loader.js?sourceMap!../../../../../node_modules/vue-loader/lib??vue-loader-options!./LtiComponent.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib/index.js?!./vendor/cl/lti/js/Console/LtiComponent.vue?vue&type=style&index=0&lang=scss&", function() {
     var newContent = __webpack_require__(/*! !../../../../../node_modules/css-loader!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/resolve-url-loader!../../../../../node_modules/sass-loader/lib/loader.js?sourceMap!../../../../../node_modules/vue-loader/lib??vue-loader-options!./LtiComponent.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib/index.js?!./vendor/cl/lti/js/Console/LtiComponent.vue?vue&type=style&index=0&lang=scss&");
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./vendor/cl/course/js/MemberSelectorVue.js":
/*!**************************************************!*\
  !*** ./vendor/cl/course/js/MemberSelectorVue.js ***!
  \**************************************************/
/*! exports provided: MemberSelectorVue */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Util_MemberSelectorVue_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Util/MemberSelectorVue.vue */ "./vendor/cl/course/js/Util/MemberSelectorVue.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MemberSelectorVue", function() { return _Util_MemberSelectorVue_vue__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/**
 * @file
 * Export of MemberSelectorVue for external use.
 */



/***/ }),

/***/ "./vendor/cl/course/js/Util/MemberSelectorVue.vue":
/*!********************************************************!*\
  !*** ./vendor/cl/course/js/Util/MemberSelectorVue.vue ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _MemberSelectorVue_vue_vue_type_template_id_52fd31c2_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MemberSelectorVue.vue?vue&type=template&id=52fd31c2&scoped=true& */ "./vendor/cl/course/js/Util/MemberSelectorVue.vue?vue&type=template&id=52fd31c2&scoped=true&");
/* harmony import */ var _MemberSelectorVue_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MemberSelectorVue.vue?vue&type=script&lang=js& */ "./vendor/cl/course/js/Util/MemberSelectorVue.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _MemberSelectorVue_vue_vue_type_style_index_0_id_52fd31c2_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MemberSelectorVue.vue?vue&type=style&index=0&id=52fd31c2&lang=scss&scoped=true& */ "./vendor/cl/course/js/Util/MemberSelectorVue.vue?vue&type=style&index=0&id=52fd31c2&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _MemberSelectorVue_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _MemberSelectorVue_vue_vue_type_template_id_52fd31c2_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _MemberSelectorVue_vue_vue_type_template_id_52fd31c2_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "52fd31c2",
  null
  
)

/* hot reload */
if (true) {
  var api = __webpack_require__(/*! ./node_modules/vue-hot-reload-api/dist/index.js */ "./node_modules/vue-hot-reload-api/dist/index.js")
  api.install(__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js"))
  if (api.compatible) {
    module.hot.accept()
    if (!module.hot.data) {
      api.createRecord('52fd31c2', component.options)
    } else {
      api.reload('52fd31c2', component.options)
    }
    module.hot.accept(/*! ./MemberSelectorVue.vue?vue&type=template&id=52fd31c2&scoped=true& */ "./vendor/cl/course/js/Util/MemberSelectorVue.vue?vue&type=template&id=52fd31c2&scoped=true&", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _MemberSelectorVue_vue_vue_type_template_id_52fd31c2_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MemberSelectorVue.vue?vue&type=template&id=52fd31c2&scoped=true& */ "./vendor/cl/course/js/Util/MemberSelectorVue.vue?vue&type=template&id=52fd31c2&scoped=true&");
(function () {
      api.rerender('52fd31c2', {
        render: _MemberSelectorVue_vue_vue_type_template_id_52fd31c2_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
        staticRenderFns: _MemberSelectorVue_vue_vue_type_template_id_52fd31c2_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]
      })
    })(__WEBPACK_OUTDATED_DEPENDENCIES__); })
  }
}
component.options.__file = "vendor/cl/course/js/Util/MemberSelectorVue.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./vendor/cl/course/js/Util/MemberSelectorVue.vue?vue&type=script&lang=js&":
/*!*********************************************************************************!*\
  !*** ./vendor/cl/course/js/Util/MemberSelectorVue.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MemberSelectorVue_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--2!../../../../../node_modules/vue-loader/lib??vue-loader-options!./MemberSelectorVue.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./vendor/cl/course/js/Util/MemberSelectorVue.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MemberSelectorVue_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./vendor/cl/course/js/Util/MemberSelectorVue.vue?vue&type=style&index=0&id=52fd31c2&lang=scss&scoped=true&":
/*!******************************************************************************************************************!*\
  !*** ./vendor/cl/course/js/Util/MemberSelectorVue.vue?vue&type=style&index=0&id=52fd31c2&lang=scss&scoped=true& ***!
  \******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_resolve_url_loader_index_js_node_modules_sass_loader_lib_loader_js_sourceMap_node_modules_vue_loader_lib_index_js_vue_loader_options_MemberSelectorVue_vue_vue_type_style_index_0_id_52fd31c2_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-style-loader!../../../../../node_modules/css-loader!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/resolve-url-loader!../../../../../node_modules/sass-loader/lib/loader.js?sourceMap!../../../../../node_modules/vue-loader/lib??vue-loader-options!./MemberSelectorVue.vue?vue&type=style&index=0&id=52fd31c2&lang=scss&scoped=true& */ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib/index.js?!./vendor/cl/course/js/Util/MemberSelectorVue.vue?vue&type=style&index=0&id=52fd31c2&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_resolve_url_loader_index_js_node_modules_sass_loader_lib_loader_js_sourceMap_node_modules_vue_loader_lib_index_js_vue_loader_options_MemberSelectorVue_vue_vue_type_style_index_0_id_52fd31c2_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_resolve_url_loader_index_js_node_modules_sass_loader_lib_loader_js_sourceMap_node_modules_vue_loader_lib_index_js_vue_loader_options_MemberSelectorVue_vue_vue_type_style_index_0_id_52fd31c2_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_resolve_url_loader_index_js_node_modules_sass_loader_lib_loader_js_sourceMap_node_modules_vue_loader_lib_index_js_vue_loader_options_MemberSelectorVue_vue_vue_type_style_index_0_id_52fd31c2_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_resolve_url_loader_index_js_node_modules_sass_loader_lib_loader_js_sourceMap_node_modules_vue_loader_lib_index_js_vue_loader_options_MemberSelectorVue_vue_vue_type_style_index_0_id_52fd31c2_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_resolve_url_loader_index_js_node_modules_sass_loader_lib_loader_js_sourceMap_node_modules_vue_loader_lib_index_js_vue_loader_options_MemberSelectorVue_vue_vue_type_style_index_0_id_52fd31c2_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./vendor/cl/course/js/Util/MemberSelectorVue.vue?vue&type=template&id=52fd31c2&scoped=true&":
/*!***************************************************************************************************!*\
  !*** ./vendor/cl/course/js/Util/MemberSelectorVue.vue?vue&type=template&id=52fd31c2&scoped=true& ***!
  \***************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_MemberSelectorVue_vue_vue_type_template_id_52fd31c2_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./MemberSelectorVue.vue?vue&type=template&id=52fd31c2&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./vendor/cl/course/js/Util/MemberSelectorVue.vue?vue&type=template&id=52fd31c2&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_MemberSelectorVue_vue_vue_type_template_id_52fd31c2_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_MemberSelectorVue_vue_vue_type_template_id_52fd31c2_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./vendor/cl/lti/js/Console/LtiComponent.vue":
/*!***************************************************!*\
  !*** ./vendor/cl/lti/js/Console/LtiComponent.vue ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _LtiComponent_vue_vue_type_template_id_68399a62___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LtiComponent.vue?vue&type=template&id=68399a62& */ "./vendor/cl/lti/js/Console/LtiComponent.vue?vue&type=template&id=68399a62&");
/* harmony import */ var _LtiComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LtiComponent.vue?vue&type=script&lang=js& */ "./vendor/cl/lti/js/Console/LtiComponent.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _LtiComponent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./LtiComponent.vue?vue&type=style&index=0&lang=scss& */ "./vendor/cl/lti/js/Console/LtiComponent.vue?vue&type=style&index=0&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _LtiComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _LtiComponent_vue_vue_type_template_id_68399a62___WEBPACK_IMPORTED_MODULE_0__["render"],
  _LtiComponent_vue_vue_type_template_id_68399a62___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (true) {
  var api = __webpack_require__(/*! ./node_modules/vue-hot-reload-api/dist/index.js */ "./node_modules/vue-hot-reload-api/dist/index.js")
  api.install(__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js"))
  if (api.compatible) {
    module.hot.accept()
    if (!module.hot.data) {
      api.createRecord('68399a62', component.options)
    } else {
      api.reload('68399a62', component.options)
    }
    module.hot.accept(/*! ./LtiComponent.vue?vue&type=template&id=68399a62& */ "./vendor/cl/lti/js/Console/LtiComponent.vue?vue&type=template&id=68399a62&", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _LtiComponent_vue_vue_type_template_id_68399a62___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LtiComponent.vue?vue&type=template&id=68399a62& */ "./vendor/cl/lti/js/Console/LtiComponent.vue?vue&type=template&id=68399a62&");
(function () {
      api.rerender('68399a62', {
        render: _LtiComponent_vue_vue_type_template_id_68399a62___WEBPACK_IMPORTED_MODULE_0__["render"],
        staticRenderFns: _LtiComponent_vue_vue_type_template_id_68399a62___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]
      })
    })(__WEBPACK_OUTDATED_DEPENDENCIES__); })
  }
}
component.options.__file = "vendor/cl/lti/js/Console/LtiComponent.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./vendor/cl/lti/js/Console/LtiComponent.vue?vue&type=script&lang=js&":
/*!****************************************************************************!*\
  !*** ./vendor/cl/lti/js/Console/LtiComponent.vue?vue&type=script&lang=js& ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_2_node_modules_vue_loader_lib_index_js_vue_loader_options_LtiComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--2!../../../../../node_modules/vue-loader/lib??vue-loader-options!./LtiComponent.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./vendor/cl/lti/js/Console/LtiComponent.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_2_node_modules_vue_loader_lib_index_js_vue_loader_options_LtiComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./vendor/cl/lti/js/Console/LtiComponent.vue?vue&type=style&index=0&lang=scss&":
/*!*************************************************************************************!*\
  !*** ./vendor/cl/lti/js/Console/LtiComponent.vue?vue&type=style&index=0&lang=scss& ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_resolve_url_loader_index_js_node_modules_sass_loader_lib_loader_js_sourceMap_node_modules_vue_loader_lib_index_js_vue_loader_options_LtiComponent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-style-loader!../../../../../node_modules/css-loader!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/resolve-url-loader!../../../../../node_modules/sass-loader/lib/loader.js?sourceMap!../../../../../node_modules/vue-loader/lib??vue-loader-options!./LtiComponent.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib/index.js?!./vendor/cl/lti/js/Console/LtiComponent.vue?vue&type=style&index=0&lang=scss&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_resolve_url_loader_index_js_node_modules_sass_loader_lib_loader_js_sourceMap_node_modules_vue_loader_lib_index_js_vue_loader_options_LtiComponent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_resolve_url_loader_index_js_node_modules_sass_loader_lib_loader_js_sourceMap_node_modules_vue_loader_lib_index_js_vue_loader_options_LtiComponent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_resolve_url_loader_index_js_node_modules_sass_loader_lib_loader_js_sourceMap_node_modules_vue_loader_lib_index_js_vue_loader_options_LtiComponent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_resolve_url_loader_index_js_node_modules_sass_loader_lib_loader_js_sourceMap_node_modules_vue_loader_lib_index_js_vue_loader_options_LtiComponent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_resolve_url_loader_index_js_node_modules_sass_loader_lib_loader_js_sourceMap_node_modules_vue_loader_lib_index_js_vue_loader_options_LtiComponent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./vendor/cl/lti/js/Console/LtiComponent.vue?vue&type=template&id=68399a62&":
/*!**********************************************************************************!*\
  !*** ./vendor/cl/lti/js/Console/LtiComponent.vue?vue&type=template&id=68399a62& ***!
  \**********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_LtiComponent_vue_vue_type_template_id_68399a62___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./LtiComponent.vue?vue&type=template&id=68399a62& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./vendor/cl/lti/js/Console/LtiComponent.vue?vue&type=template&id=68399a62&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_LtiComponent_vue_vue_type_template_id_68399a62___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_LtiComponent_vue_vue_type_template_id_68399a62___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./vendor/cl/lti/js/Console/LtiConsole.js":
/*!************************************************!*\
  !*** ./vendor/cl/lti/js/Console/LtiConsole.js ***!
  \************************************************/
/*! exports provided: LtiConsole */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LtiConsole", function() { return LtiConsole; });
/* harmony import */ var users_cl_js_Users_User__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! users-cl/js/Users/User */ "./vendor/cl/users/js/Users/User.js");
/* harmony import */ var _LtiComponent_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LtiComponent.vue */ "./vendor/cl/lti/js/Console/LtiComponent.vue");
/**
 * @file
 * LTI console components
 */


var LtiConsole = function LtiConsole(site) {
  var Console = site.console;
  Console.tables.add({
    title: 'LTI',
    order: 90,
    api: '/api/lti/tables'
  });
  Console.components.addOption({
    atLeast: {
      tag: 'lti-view-submissions',
      default: users_cl_js_Users_User__WEBPACK_IMPORTED_MODULE_0__["User"].STAFF
    },
    page: {
      title: 'Main',
      route: '',
      order: 1
    },
    section: {
      title: 'Lti',
      order: 20
    },
    title: 'LTI Submissions',
    order: 1,
    route: '/lti',
    routes: [{
      route: '/lti',
      component: _LtiComponent_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
    }]
  });
};

/***/ }),

/***/ "./vendor/cl/lti/js/Console/index.js":
/*!*******************************************!*\
  !*** ./vendor/cl/lti/js/Console/index.js ***!
  \*******************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _LtiConsole__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LtiConsole */ "./vendor/cl/lti/js/Console/LtiConsole.js");
/**
 * @file
 * Course console entry point.
 */

new _LtiConsole__WEBPACK_IMPORTED_MODULE_0__["LtiConsole"](Site.Site);

/***/ }),

/***/ "./vendor/cl/users/js/Users/User.js":
/*!******************************************!*\
  !*** ./vendor/cl/users/js/Users/User.js ***!
  \******************************************/
/*! exports provided: default, User */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "User", function() { return User; });
/**
 * @file
 * Represents a user in the system
 */
var User = function User(json) {
  /// The user role - local so we can protect it with getter/setter
  var role = 'G'; // Installed membership

  var member = null;

  if (json !== undefined) {
    if (typeof json === 'string') {
      json = JSON.parse(json);
    }

    this.id = json.id;
    role = json.role;
    this.name = json.name;
    this.email = json.email;
    this.userId = json.user; // Installed membership

    member = User.instantiateMember(json);

    if (member !== null) {
      member.user = this;
    }
  } else {
    this.id = 0;
    role = 'G';
    this.name = '';
    this.email = '';
    this.userId = '';
  }

  Object.defineProperty(this, 'member', {
    get: function get() {
      return member;
    }
  });
  /**
   * Return the effective role for the user.
   * This is the user's role unless the user
   * has a membership, in which case it is the
   * membership role.
   *
   * @returns {string}
   */

  this.role = function () {
    if (member !== null) {
      return member.role();
    }

    return role;
  };

  this.setUserRole = function (_role) {
    role = _role;
  };

  this.userRole = function () {
    return role;
  };
  /**
   * Set the membership for this user
   * @param Membership member
   */


  this.setMember = function (_member) {
    member = _member;

    if (member !== null) {
      member.user = this;
    }
  };
};

User.GUEST = 'G';
User.USER = 'U';
User.STAFF = 'S';
User.ADMIN = 'A';

User.getUserRoles = function () {
  var roles = {};
  roles[User.GUEST] = {
    name: 'Guest',
    priority: 1
  };
  roles[User.USER] = {
    name: 'User',
    priority: 2
  };
  roles[User.STAFF] = {
    name: 'Staff',
    priority: 3
  };
  roles[User.ADMIN] = {
    name: 'Admin',
    priority: 4
  };
  return roles;
};

User.prototype.getUserRoles = function () {
  return User.getUserRoles();
};
/**
 * Get the roles for this user. Membership roles take priority
 * over roles for just a user who is not a member.
 */


User.prototype.getRoles = function () {
  var member = this.member;

  if (member !== null) {
    return member.getRoles();
  }

  return User.getUserRoles();
};

User.prototype.atLeast = function (atLeast) {
  var role = this.role();
  var roles = this.getRoles();

  if (roles.hasOwnProperty(atLeast)) {
    return roles[role].priority >= roles[atLeast].priority;
  } else {
    return false;
  }
};

User.prototype.getRolePriority = function (role) {
  var roles = this.getRoles();

  if (roles.hasOwnProperty(role)) {
    return roles[role].priority;
  }

  return 0;
};

User.prototype.displayName = function () {
  var comma = this.name.indexOf(',');

  if (comma < 0) {
    return this.name;
  }

  var last = this.name.substr(0, comma);
  var first = this.name.substr(comma + 1).trim();
  return first + ' ' + last;
};

User.prototype.userRoleName = function () {
  var roles = this.getUserRoles();
  var role = this.userRole();
  var r = roles[role];

  if (r === undefined) {
    return 'Invalid';
  }

  if (short === true && r.short !== undefined) {
    return r.short;
  }

  return r.name;
};
/**
 * Return the role name for this user.
 * @param short If set to true, a short version is supplied if available.
 * @returns string
 */


User.prototype.roleName = function (short) {
  var roles = this.getRoles();
  var role = this.role();
  var r = roles[role];

  if (r === undefined) {
    return 'Invalid';
  }

  if (short === true && r.short !== undefined) {
    return r.short;
  }

  return r.name;
};

User.compare = function (a, b) {
  var an = a.name.toLowerCase();
  var bn = b.name.toLowerCase();

  if (an < bn) {
    return -1;
  }

  if (an > bn) {
    return 1;
  }

  return a.id - b.id;
};
/**
 * Instantiate a Membership object for the user.
 * This will be replaced by a plugin that adds
 * support for memberships.
 * @param data normally in the format the PHP JSON representation
 * @returns {null}
 */


User.instantiateMember = function (data) {
  return null;
};

/* harmony default export */ __webpack_exports__["default"] = (User);


/***/ })

},[["./vendor/cl/lti/js/Console/index.js","runtime","vendor"]]]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9bbmFtZV0vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL1tuYW1lXS92ZW5kb3IvY2wvY291cnNlL2pzL1V0aWwvTWVtYmVyU2VsZWN0b3JWdWUudnVlIiwid2VicGFjazovL1tuYW1lXS92ZW5kb3IvY2wvbHRpL2pzL0NvbnNvbGUvTHRpQ29tcG9uZW50LnZ1ZSIsIndlYnBhY2s6Ly9bbmFtZV0vLi92ZW5kb3IvY2wvY291cnNlL2pzL1V0aWwvTWVtYmVyU2VsZWN0b3JWdWUudnVlP2ZlZmEiLCJ3ZWJwYWNrOi8vW25hbWVdLy4vdmVuZG9yL2NsL2x0aS9qcy9Db25zb2xlL0x0aUNvbXBvbmVudC52dWU/OWY0OCIsIndlYnBhY2s6Ly9bbmFtZV0vLi92ZW5kb3IvY2wvY291cnNlL2pzL1V0aWwvTWVtYmVyU2VsZWN0b3JWdWUudnVlPzY2YTUiLCJ3ZWJwYWNrOi8vW25hbWVdLy4vdmVuZG9yL2NsL2x0aS9qcy9Db25zb2xlL0x0aUNvbXBvbmVudC52dWU/YzI0YiIsIndlYnBhY2s6Ly9bbmFtZV0vLi92ZW5kb3IvY2wvY291cnNlL2pzL1V0aWwvTWVtYmVyU2VsZWN0b3JWdWUudnVlPzBiNWQiLCJ3ZWJwYWNrOi8vW25hbWVdLy4vdmVuZG9yL2NsL2x0aS9qcy9Db25zb2xlL0x0aUNvbXBvbmVudC52dWU/NzRmYiIsIndlYnBhY2s6Ly9bbmFtZV0vLi92ZW5kb3IvY2wvY291cnNlL2pzL01lbWJlclNlbGVjdG9yVnVlLmpzIiwid2VicGFjazovL1tuYW1lXS8uL3ZlbmRvci9jbC9jb3Vyc2UvanMvVXRpbC9NZW1iZXJTZWxlY3RvclZ1ZS52dWUiLCJ3ZWJwYWNrOi8vW25hbWVdLy4vdmVuZG9yL2NsL2NvdXJzZS9qcy9VdGlsL01lbWJlclNlbGVjdG9yVnVlLnZ1ZT84NTFlIiwid2VicGFjazovL1tuYW1lXS8uL3ZlbmRvci9jbC9jb3Vyc2UvanMvVXRpbC9NZW1iZXJTZWxlY3RvclZ1ZS52dWU/ODVlMCIsIndlYnBhY2s6Ly9bbmFtZV0vLi92ZW5kb3IvY2wvY291cnNlL2pzL1V0aWwvTWVtYmVyU2VsZWN0b3JWdWUudnVlPzVhZmEiLCJ3ZWJwYWNrOi8vW25hbWVdLy4vdmVuZG9yL2NsL2x0aS9qcy9Db25zb2xlL0x0aUNvbXBvbmVudC52dWUiLCJ3ZWJwYWNrOi8vW25hbWVdLy4vdmVuZG9yL2NsL2x0aS9qcy9Db25zb2xlL0x0aUNvbXBvbmVudC52dWU/NGUyMSIsIndlYnBhY2s6Ly9bbmFtZV0vLi92ZW5kb3IvY2wvbHRpL2pzL0NvbnNvbGUvTHRpQ29tcG9uZW50LnZ1ZT8yMWQ0Iiwid2VicGFjazovL1tuYW1lXS8uL3ZlbmRvci9jbC9sdGkvanMvQ29uc29sZS9MdGlDb21wb25lbnQudnVlPzgwNjQiLCJ3ZWJwYWNrOi8vW25hbWVdLy4vdmVuZG9yL2NsL2x0aS9qcy9Db25zb2xlL0x0aUNvbnNvbGUuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4vdmVuZG9yL2NsL2x0aS9qcy9Db25zb2xlL2luZGV4LmpzIiwid2VicGFjazovL1tuYW1lXS8uL3ZlbmRvci9jbC91c2Vycy9qcy9Vc2Vycy9Vc2VyLmpzIl0sIm5hbWVzIjpbIkx0aUNvbnNvbGUiLCJzaXRlIiwiQ29uc29sZSIsImNvbnNvbGUiLCJ0YWJsZXMiLCJhZGQiLCJ0aXRsZSIsIm9yZGVyIiwiYXBpIiwiY29tcG9uZW50cyIsImFkZE9wdGlvbiIsImF0TGVhc3QiLCJ0YWciLCJkZWZhdWx0IiwiVXNlciIsIlNUQUZGIiwicGFnZSIsInJvdXRlIiwic2VjdGlvbiIsInJvdXRlcyIsImNvbXBvbmVudCIsIkx0aUNvbXBvbmVudCIsIlNpdGUiLCJqc29uIiwicm9sZSIsIm1lbWJlciIsInVuZGVmaW5lZCIsIkpTT04iLCJwYXJzZSIsImlkIiwibmFtZSIsImVtYWlsIiwidXNlcklkIiwidXNlciIsImluc3RhbnRpYXRlTWVtYmVyIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXQiLCJzZXRVc2VyUm9sZSIsIl9yb2xlIiwidXNlclJvbGUiLCJzZXRNZW1iZXIiLCJfbWVtYmVyIiwiR1VFU1QiLCJVU0VSIiwiQURNSU4iLCJnZXRVc2VyUm9sZXMiLCJyb2xlcyIsInByaW9yaXR5IiwicHJvdG90eXBlIiwiZ2V0Um9sZXMiLCJoYXNPd25Qcm9wZXJ0eSIsImdldFJvbGVQcmlvcml0eSIsImRpc3BsYXlOYW1lIiwiY29tbWEiLCJpbmRleE9mIiwibGFzdCIsInN1YnN0ciIsImZpcnN0IiwidHJpbSIsInVzZXJSb2xlTmFtZSIsInIiLCJzaG9ydCIsInJvbGVOYW1lIiwiY29tcGFyZSIsImEiLCJiIiwiYW4iLCJ0b0xvd2VyQ2FzZSIsImJuIiwiZGF0YSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2lCQTtBQUVBO0FBQ0EsVUFDQSxVQURBLENBREE7QUFJQTtBQUNBO0FBQ0EsZUFEQTtBQUVBLGdCQUZBO0FBR0EscUJBSEE7QUFJQSxZQUpBO0FBS0Esb0JBTEE7QUFNQSxpQkFOQTtBQU9BLGdCQVBBO0FBUUEsaUJBUkE7QUFTQSw0REFUQTtBQVVBO0FBVkE7QUFZQSxHQWpCQTtBQWtCQTtBQUNBLFNBREEsaUJBQ0EsS0FEQSxFQUNBLE1BREEsRUFDQTtBQUFBOztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUFBO0FBRUE7QUFDQTtBQUNBLE9BRkEsRUFFQSxHQUZBO0FBR0E7QUFmQSxHQWxCQTtBQW1DQTtBQUNBLFNBREEsaUJBQ0EsS0FEQSxFQUNBO0FBQUE7O0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFBQTtBQUVBO0FBRUE7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQkFEQTtBQUVBLHFCQUZBO0FBR0Esb0JBSEE7QUFJQSxpQ0FKQTtBQUtBO0FBTEE7QUFPQSxrREFDQSxJQURBLENB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QUFDckMsRUFBaEI7QUFDSCxDQWJEO0FBZUE7Ozs7Ozs7OztBQU9BZixJQUFJLENBQUNvQixpQkFBTCxHQUF5QixVQUFTb0MsSUFBVCxFQUFlO0FBQ3BDLFNBQU8sSUFBUDtBQUNILENBRkQ7O0FBSWV4RCxtRUFBZiIsImZpbGUiOiJsdGljb25zb2xlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiTHRpQ29uc29sZVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJMdGlDb25zb2xlXCJdID0gZmFjdG9yeSgpO1xufSkod2luZG93LCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCI8IS0tXHJcbi8qKlxyXG4gKiBAZmlsZVxyXG4gKiBTaW1wbGUgY29tcG9uZW50IGZvciBzZWxlY3RpbmcgYSB1c2VyIGluIHRoZSBzeXN0ZW0uXHJcbiAqL1xyXG4tLT5cclxuPHRlbXBsYXRlPlxyXG4gIDxzcGFuPlxyXG4gICAgPGRpdiBjbGFzcz1cImNsLWlucHV0XCI+PGlucHV0IHYtbW9kZWw9XCJxdWVyeVwiIHR5cGU9XCJ0ZXh0XCIgbWF4bGVuZ3RoPVwiMTUwXCI+XHJcbiAgICAgIDxhIEBjbGljay5wcmV2ZW50PVwiZmV0Y2gocXVlcnkpXCIgY2xhc3M9XCJzZWFyY2hlclwiPjxpbWcgOnNyYz1cInNlYXJjaGVyXCI+PC9hPlxyXG4gICAgICA8ZGl2IHYtaWY9XCJyZXN1bHQubGVuZ3RoID4gMCB8fCBub3Jlc3VsdFwiIGNsYXNzPVwiY2wtcmVzdWx0c1wiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjbC1yZXN1bHQtbGlzdFwiPlxyXG4gICAgICAgICAgPGRpdiB2LWZvcj1cInVzZXIgaW4gcmVzdWx0XCIgQGNsaWNrLnByZXZlbnQ9XCJzZWxlY3RVc2VyKHVzZXIpXCI+PHNwYW4+PGFcclxuICAgICAgICAgICAgQGNsaWNrLnByZXZlbnQ9XCJzZWxlY3RVc2VyKHVzZXIpXCI+e3t1c2VyLnVzZXJJZH19PC9hPjwvc3Bhbj5cclxuICAgICAgICAgICAgPHNwYW4+PGEgQGNsaWNrLnByZXZlbnQ9XCJzZWxlY3RVc2VyKHVzZXIpXCI+e3t1c2VyLm5hbWV9fTwvYT48L3NwYW4+PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgdi1pZj1cIm5vcmVzdWx0XCIgY2xhc3M9XCJzdGF0ZW1lbnRcIj5ObyByZXN1bHRzLi4uPC9kaXY+XHJcbiAgICAgICAgPGRpdiB2LWlmPVwibW9yZVwiIGNsYXNzPVwic3RhdGVtZW50XCI+Li4ubW9yZS4uLjwvZGl2PlxyXG5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj4gPGEgQGNsaWNrLnByZXZlbnQ9XCJjbGVhclwiPjxpbWcgOnNyYz1cImRlbGV0ZXJcIj48L2E+XHJcbiAgPC9zcGFuPlxyXG48L3RlbXBsYXRlPlxyXG5cclxuPHNjcmlwdD5cclxuXHJcbiAgY29uc3QgTElNSVQgPSAyMDtcclxuXHJcbiAgICBleHBvcnQgZGVmYXVsdCB7XHJcbiAgICAgICAgcHJvcHM6IFtcclxuICAgICAgICAgICAgJ3NlbGVjdGVkJ1xyXG4gICAgICAgIF0sXHJcbiAgICAgICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBxdWVyeTogJycsXHJcbiAgICAgICAgICAgICAgICByZXN1bHQ6IFtdLFxyXG4gICAgICAgICAgICAgICAgbm9yZXN1bHQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc2VxOiAxLFxyXG4gICAgICAgICAgICAgICAgZmV0Y2hlZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB0aW1lcjogbnVsbCxcclxuICAgICAgICAgICAgICAgIHNldDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBtb3JlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHNlYXJjaGVyOiBTaXRlLnJvb3QgKyAnL3ZlbmRvci9jbC9zaXRlL2ltZy9zZWFyY2gucG5nJyxcclxuICAgICAgICAgICAgICAgIGRlbGV0ZXI6IFNpdGUucm9vdCArICcvdmVuZG9yL2NsL3NpdGUvaW1nL3gucG5nJyxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgd2F0Y2g6IHtcclxuICAgICAgICAgICAgcXVlcnkoYWZ0ZXIsIGJlZm9yZSkge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5zZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLnRpbWVyICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGltZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mZXRjaChhZnRlcik7XHJcbiAgICAgICAgICAgICAgICB9LCAzMDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXRob2RzOiB7XHJcbiAgICAgICAgICAgIGZldGNoKHF1ZXJ5KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZmV0Y2gnKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHF1ZXJ5KTtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMudGltZXIgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aW1lciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQobnVsbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcXVlcnkgPSBxdWVyeS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICBpZihxdWVyeS5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mZXRjaGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXN1bHQgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXErKztcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1lbWJlciA9IHRoaXMuJHN0b3JlLnN0YXRlLnVzZXIudXNlci5tZW1iZXI7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaDogcXVlcnksXHJcbiAgICAgICAgICAgICAgICAgICAgc2VxOiB0aGlzLnNlcSxcclxuICAgICAgICAgICAgICAgICAgICBsaW1pdDogTElNSVQsXHJcbiAgICAgICAgICAgICAgICAgICAgc2VtZXN0ZXI6IG1lbWJlci5zZW1lc3RlcixcclxuICAgICAgICAgICAgICAgICAgICBzZWN0aW9uOiBtZW1iZXIuc2VjdGlvblxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIFNpdGUuYXBpLmdldCgnL2FwaS9jb3Vyc2UvbWVtYmVycycsIHBhcmFtcylcclxuICAgICAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXJlc3BvbnNlLmhhc0Vycm9yKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgcHJvdGVjdHMgZnJvbSBvdXQtb2Ytb3JkZXIgcHJvY2Vzc2luZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gb2YgcmVzdWx0cyBmcm9tIHRoZSBzZXJ2ZXIuLi5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlcSA9IHJlc3BvbnNlLmdldERhdGEoJ3NlcScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoK3NlcS5pZCAhPT0gdGhpcy5zZXEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IHJlc3BvbnNlLmdldERhdGEoJ3VzZXJzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihkYXRhICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXN1bHQgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vcmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmF0dHJpYnV0ZXMuZm9yRWFjaCgodXNlckRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodXNlckRhdGEubW9yZSAhPT0gJ3llcycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB1c2VyID0gbmV3IFVzZXJzLlVzZXIodXNlckRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXN1bHQucHVzaCh1c2VyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW9yZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vcmVzdWx0ID0gKHRoaXMucmVzdWx0Lmxlbmd0aCA9PT0gMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU2l0ZS50b2FzdCh0aGlzLCByZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgU2l0ZS50b2FzdCh0aGlzLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlbGVjdFVzZXIodXNlcikgeztcclxuICAgICAgICAgICAgICAgIHRoaXMucXVlcnkgPSB1c2VyLm5hbWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3VsdCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub3Jlc3VsdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3JlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkKHVzZXIpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjbGVhcigpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VxKys7IC8vIEp1c3QgaW4gY2FzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXN1bHQgPSBbXTtcclxuICAgICAgICAgICAgICAgIHRoaXMubm9yZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubW9yZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5xdWVyeSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZChudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbjwvc2NyaXB0PlxyXG5cclxuPHN0eWxlIGxhbmc9XCJzY3NzXCIgc2NvcGVkPlxyXG5cclxuICBhLnNlYXJjaGVyIHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHRvcDogMDtcclxuICAgIHJpZ2h0OiAwO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgbWluLWhlaWdodDogMTAwJTtcclxuICAgIHdpZHRoOiAyMXB4O1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgYmFja2dyb3VuZDogI2FhYWFhYTtcclxuXHJcbiAgICBpbWcge1xyXG4gICAgICBoZWlnaHQ6IDE2cHg7XHJcbiAgICAgIHdpZHRoOiAxNnB4O1xyXG4gICAgICB2ZXJ0aWNhbC1hbGlnbjogLTRweDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRpdi5jbC1pbnB1dCB7XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICB3aWR0aDogMzAwcHg7XHJcblxyXG5cclxuICAgIGlucHV0IHtcclxuICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNjY2NjY2M7XHJcbiAgICB9XHJcblxyXG4gICAgZGl2LmNsLXJlc3VsdHMge1xyXG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgIGxlZnQ6IDA7XHJcbiAgICAgIHJpZ2h0OiAwO1xyXG4gICAgICB0b3A6IDEwMCU7XHJcbiAgICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICAgIGZvbnQtc2l6ZTogMC44NWVtO1xyXG5cclxuICAgICAgYmFja2dyb3VuZDogd2hpdGU7XHJcbiAgICAgIGJvcmRlci1sZWZ0OiAxcHggc29saWQgYmxhY2s7XHJcbiAgICAgIGJvcmRlci1yaWdodDogMXB4IHNvbGlkIGJsYWNrO1xyXG4gICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgYmxhY2s7XHJcblxyXG4gICAgICBkaXYuY2wtcmVzdWx0LWxpc3Qge1xyXG4gICAgICAgIGRpc3BsYXk6IHRhYmxlO1xyXG4gICAgICAgIHdpZHRoOiAxMDAlO1xyXG5cclxuXHJcbiAgICAgICAgZGl2IHtcclxuICAgICAgICAgIGRpc3BsYXk6IHRhYmxlLXJvdztcclxuICAgICAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjODg4ODg4O1xyXG4gICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG5cclxuICAgICAgICAgIHNwYW4ge1xyXG4gICAgICAgICAgICBkaXNwbGF5OiB0YWJsZS1jZWxsO1xyXG4gICAgICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xyXG4gICAgICAgICAgICB0ZXh0LWFsaWduOiBsZWZ0O1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAwLjVlbSAwLjI1ZW07XHJcblxyXG4gICAgICAgICAgICBhIHtcclxuICAgICAgICAgICAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcbiAgICAgICAgICAgICAgY29sb3I6IGJsYWNrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBhOmhvdmVyIHtcclxuICAgICAgICAgICAgICBjb2xvcjogIzg4ODg4ODtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHNwYW46Zmlyc3QtY2hpbGQge1xyXG4gICAgICAgICAgICBmb250LXN0eWxlOiBpdGFsaWM7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgc3BhbjpsYXN0LWNoaWxkIHtcclxuICAgICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgICAgICAgICAgd2lkdGg6IDk5JTtcclxuXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgIGRpdjpmaXJzdC1jaGlsZCwgZGl2Omxhc3QtY2hpbGQge1xyXG4gICAgICAgICAgc3BhbiB7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDAuMjVlbSAwLjI1ZW07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgZGl2LnN0YXRlbWVudCB7XHJcbiAgICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgICAgICBmb250LXN0eWxlOiBpdGFsaWM7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG48L3N0eWxlPiIsIjx0ZW1wbGF0ZT5cclxuICA8ZGl2IGNsYXNzPVwiY29udGVudCBjbC1sdGktY29uc29sZVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImZ1bGxcIj5cclxuICAgICAgPHA+PGxhYmVsPjxzcGFuPkFzc2lnbm1lbnQ6IDwvc3Bhbj48c2VsZWN0IHYtbW9kZWw9XCJzZWxlY3RlZEFzc2lnbm1lbnRcIj5cclxuICAgICAgICA8b3B0aW9uPmFueTwvb3B0aW9uPlxyXG4gICAgICAgIDxvcHRpb24gdi1mb3I9XCJhcHAgaW4gYXNzaWduVGFnc1wiPnt7YXBwfX08L29wdGlvbj5cclxuICAgICAgPC9zZWxlY3Q+PC9sYWJlbD48L3A+XHJcbiAgICAgIDxwPjxsYWJlbD48c3Bhbj5HcmFkZSBpdGVtOiA8L3NwYW4+PHNlbGVjdCB2LW1vZGVsPVwic2VsZWN0ZWRHcmFkZVwiPlxyXG4gICAgICAgIDxvcHRpb24+YW55PC9vcHRpb24+XHJcbiAgICAgICAgPG9wdGlvbj5ub25lPC9vcHRpb24+XHJcbiAgICAgICAgPG9wdGlvbiB2LWZvcj1cImFwcCBpbiBncmFkZVRhZ3NcIj57e2FwcH19PC9vcHRpb24+XHJcbiAgICAgIDwvc2VsZWN0PjwvbGFiZWw+PC9wPlxyXG4gICAgICA8cD48bGFiZWw+PHNwYW4+TWVtYmVyOiA8L3NwYW4+PHVzZXItc2VsZWN0b3IgOnNlbGVjdGVkPVwic2VsZWN0ZWRcIj48L3VzZXItc2VsZWN0b3I+PC9sYWJlbD48L3A+XHJcbiAgICAgIDxwIGNsYXNzPVwiY2VudGVyXCI+PGJ1dHRvbiA6ZGlzYWJsZWQ9XCJ1c2VyID09PSBudWxsXCIgQGNsaWNrLnByZXZlbnQ9XCJxdWVyeSgpXCI+UXVlcnk8L2J1dHRvbj48L3A+XHJcblxyXG4gICAgICA8ZGl2IHYtaWY9XCJmZXRjaGVkXCI+XHJcbiAgICAgICAgPHRhYmxlIGNsYXNzPVwic21hbGxcIiB2LWlmPVwicmVzdWx0cy5sZW5ndGggPiAwXCI+XHJcbiAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgIDx0aD5Vc2VyPC90aD5cclxuICAgICAgICAgICAgPHRoPk5hbWU8L3RoPlxyXG4gICAgICAgICAgICA8dGg+QXNzaWduPC90aD5cclxuICAgICAgICAgICAgPHRoPkl0ZW08L3RoPlxyXG4gICAgICAgICAgICA8dGg+RmlsZTwvdGg+XHJcbiAgICAgICAgICAgIDx0aD5DcmVhdGVkPC90aD5cclxuICAgICAgICAgICAgPHRoPk1vZGlmaWVkPC90aD5cclxuICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICA8dHIgdi1mb3I9XCJyZXN1bHQgaW4gcmVzdWx0c1wiPlxyXG4gICAgICAgICAgICA8dGQgOmNsYXNzPVwicmVzdWx0LnVzZXIudXNlci5sZW5ndGggPiAxMCA/ICdzbWFsbCcgOiAnJ1wiPnt7cmVzdWx0LnVzZXIudXNlcn19PC90ZD5cclxuICAgICAgICAgICAgPHRkPnt7cmVzdWx0LnVzZXIubmFtZX19PC90ZD5cclxuICAgICAgICAgICAgPHRkPnt7cmVzdWx0LmFzc2lnblRhZ319PC90ZD5cclxuICAgICAgICAgICAgPHRkPnt7cmVzdWx0LmdyYWRlVGFnfX08L3RkPlxyXG4gICAgICAgICAgICA8dGQ+PGEgOmhyZWY9XCJ0b1ZpZXcgKyBwYXRoKHJlc3VsdClcIiB0YXJnZXQ9XCJfZmlsZVwiPjxpbWcgOnNyYz1cInRvVmlld0ltZ1wiPjwvYT5cclxuICAgICAgICAgICAgICA8YSA6aHJlZj1cInRvRG93bmxvYWQgKyBwYXRoKHJlc3VsdClcIj48aW1nIDpzcmM9XCJ0b0Rvd25sb2FkSW1nXCI+PC9hPjwvdGQ+XHJcbiAgICAgICAgICAgIDx0ZCBjbGFzcz1cInNtYWxsXCI+e3tyZXN1bHQuY3JlYXRlZFN0cn19PC90ZD5cclxuICAgICAgICAgICAgPHRkIGNsYXNzPVwic21hbGxcIj57e3Jlc3VsdC5tb2RpZmllZFN0cn19PC90ZD5cclxuICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgPC90YWJsZT5cclxuICAgICAgICA8cCB2LWlmPVwicmVzdWx0cy5sZW5ndGggPT09IDBcIiBjbGFzcz1cImNlbnRlcmJveCBzZWNvbmRiIGNlbnRlclwiPk5vIGZpbGVzLi4uPC9wPlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgPC9kaXY+XHJcbjwvdGVtcGxhdGU+XHJcblxyXG48c2NyaXB0PlxyXG4gICAgaW1wb3J0IHtNZW1iZXJTZWxlY3RvclZ1ZX0gZnJvbSAnY291cnNlLWNsL2pzL01lbWJlclNlbGVjdG9yVnVlJztcclxuXHJcbiAgICBleHBvcnQgZGVmYXVsdCB7XHJcbiAgICAgICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RlZEFzc2lnbm1lbnQ6ICdhbnknLFxyXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRHcmFkZTogJ2FueScsXHJcbiAgICAgICAgICAgICAgICB1c2VyOiBudWxsLFxyXG5cclxuICAgICAgICAgICAgICAgIGFzc2lnblRhZ3M6IFtdLFxyXG4gICAgICAgICAgICAgICAgZ3JhZGVUYWdzOiBbXSxcclxuXHJcbiAgICAgICAgICAgICAgICB0b1ZpZXc6IFNpdGUucm9vdCArICcvY2wvbHRpL3ZpZXcnLFxyXG4gICAgICAgICAgICAgICAgdG9Eb3dubG9hZDogU2l0ZS5yb290ICsgJy9jbC9sdGkvZG93bmxvYWQnLFxyXG4gICAgICAgICAgICAgICAgdG9Eb3dubG9hZEltZzogU2l0ZS5yb290ICsgJy92ZW5kb3IvY2wvc2l0ZS9pbWcvZG93bmxvYWQucG5nJyxcclxuICAgICAgICAgICAgICAgIHRvVmlld0ltZzogU2l0ZS5yb290ICsgJy92ZW5kb3IvY2wvc2l0ZS9pbWcvZXllMTYucG5nJyxcclxuXHJcbiAgICAgICAgICAgICAgICBmZXRjaGVkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHJlc3VsdHM6IFtdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBtb3VudGVkKCkge1xyXG4gICAgICAgICAgICB0aGlzLiRwYXJlbnQuc2V0VGl0bGUoJzogTFRJIEF1ZGl0aW5nJyk7XHJcblxyXG4gICAgICAgICAgICBTaXRlLmFwaS5nZXQoJy9hcGkvbHRpL2l0ZW1zJywge30pXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZighcmVzcG9uc2UuaGFzRXJyb3IoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHJlc3BvbnNlLmdldERhdGEoJ2Fzc2lnbnRhZ3MnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZGF0YSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hc3NpZ25UYWdzID0gZGF0YS5hdHRyaWJ1dGVzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gcmVzcG9uc2UuZ2V0RGF0YSgnZ3JhZGVUYWdzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGRhdGEgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JhZGVUYWdzID0gZGF0YS5hdHRyaWJ1dGVzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgU2l0ZS50b2FzdCh0aGlzLCByZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIFNpdGUudG9hc3QodGhpcywgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgICBjb21wb25lbnRzOiB7XHJcbiAgICAgICAgICAgICd1c2VyLXNlbGVjdG9yJzogTWVtYmVyU2VsZWN0b3JWdWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1ldGhvZHM6IHtcclxuICAgICAgICAgICAgc2VsZWN0ZWQodXNlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51c2VyID0gdXNlcjtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcXVlcnkoKSB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLnVzZXIgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5mZXRjaGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWVtYmVySWQnOiB0aGlzLnVzZXIubWVtYmVyLmlkXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuc2VsZWN0ZWRBc3NpZ25tZW50ICE9PSAnYW55Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy5hc3NpZ25UYWcgPSB0aGlzLnNlbGVjdGVkQXNzaWdubWVudDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5zZWxlY3RlZEdyYWRlICE9PSAnYW55Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuc2VsZWN0ZWRHcmFkZSA9PT0gJ25vbmUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtcy5ncmFkZVRhZyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtcy5ncmFkZVRhZyA9IHRoaXMuc2VsZWN0ZWRHcmFkZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgU2l0ZS5hcGkuZ2V0KCcvYXBpL2x0aScsIHBhcmFtcylcclxuICAgICAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXJlc3BvbnNlLmhhc0Vycm9yKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2hlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHJlc3BvbnNlLmdldERhdGEoJ291dGNvbWVzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihkYXRhICE9PSBudWxsKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEuYXR0cmlidXRlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXN1bHRzID0gZGF0YS5hdHRyaWJ1dGVzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU2l0ZS50b2FzdCh0aGlzLCByZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgU2l0ZS50b2FzdCh0aGlzLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBhdGgocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYXNzaWduVGFnID0gcmVzdWx0LmFzc2lnblRhZyAhPT0gJycgPyByZXN1bHQuYXNzaWduVGFnIDogJy0nO1xyXG4gICAgICAgICAgICAgICAgbGV0IGdyYWRlVGFnID0gcmVzdWx0LmdyYWRlVGFnICE9PSAnJyA/IHJlc3VsdC5ncmFkZVRhZyA6ICctJztcclxuICAgICAgICAgICAgICAgIHJldHVybiAnLycgKyByZXN1bHQudXNlci5tZW1iZXIuaWQgKyAnLycgKyBhc3NpZ25UYWcgKyAnLycgKyBncmFkZVRhZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuPC9zY3JpcHQ+XHJcblxyXG4vLyBOb3RpY2U6IE5vdCBzY29wZWQhXHJcbjxzdHlsZSBsYW5nPVwic2Nzc1wiPlxyXG5kaXYuY2wtbHRpLWNvbnNvbGUge1xyXG5cclxuICBsYWJlbCBzcGFuOmZpcnN0LWNoaWxkIHtcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgIHdpZHRoOiAxMGVtO1xyXG4gICAgdGV4dC1hbGlnbjogcmlnaHQ7XHJcbiAgICBwYWRkaW5nOiAwIDAuMjVlbSAwIDA7XHJcbiAgfVxyXG5cclxuICBpbnB1dFt0eXBlPXRleHRdLCBvcHRpb24ge1xyXG4gICAgcGFkZGluZzogMXB4IDAuMjVlbTtcclxuICB9XHJcblxyXG4gIHNlbGVjdCB7XHJcbiAgICBtaW4td2lkdGg6IDE1ZW07XHJcbiAgfVxyXG5cclxuICBidXR0b246ZGlzYWJsZWQge1xyXG4gICAgY29sb3I6IGdyYXk7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuPC9zdHlsZT4iLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKGZhbHNlKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcImEuc2VhcmNoZXJbZGF0YS12LTUyZmQzMWMyXSB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDA7XFxuICByaWdodDogMDtcXG4gIGhlaWdodDogMTAwJTtcXG4gIG1pbi1oZWlnaHQ6IDEwMCU7XFxuICB3aWR0aDogMjFweDtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGJhY2tncm91bmQ6ICNhYWFhYWE7XFxufVxcbmEuc2VhcmNoZXIgaW1nW2RhdGEtdi01MmZkMzFjMl0ge1xcbiAgaGVpZ2h0OiAxNnB4O1xcbiAgd2lkdGg6IDE2cHg7XFxuICB2ZXJ0aWNhbC1hbGlnbjogLTRweDtcXG59XFxuZGl2LmNsLWlucHV0W2RhdGEtdi01MmZkMzFjMl0ge1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgd2lkdGg6IDMwMHB4O1xcbn1cXG5kaXYuY2wtaW5wdXQgaW5wdXRbZGF0YS12LTUyZmQzMWMyXSB7XFxuICB3aWR0aDogMTAwJTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkICNjY2NjY2M7XFxufVxcbmRpdi5jbC1pbnB1dCBkaXYuY2wtcmVzdWx0c1tkYXRhLXYtNTJmZDMxYzJdIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGxlZnQ6IDA7XFxuICByaWdodDogMDtcXG4gIHRvcDogMTAwJTtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxuICBmb250LXNpemU6IDAuODVlbTtcXG4gIGJhY2tncm91bmQ6IHdoaXRlO1xcbiAgYm9yZGVyLWxlZnQ6IDFweCBzb2xpZCBibGFjaztcXG4gIGJvcmRlci1yaWdodDogMXB4IHNvbGlkIGJsYWNrO1xcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIGJsYWNrO1xcbn1cXG5kaXYuY2wtaW5wdXQgZGl2LmNsLXJlc3VsdHMgZGl2LmNsLXJlc3VsdC1saXN0W2RhdGEtdi01MmZkMzFjMl0ge1xcbiAgZGlzcGxheTogdGFibGU7XFxuICB3aWR0aDogMTAwJTtcXG59XFxuZGl2LmNsLWlucHV0IGRpdi5jbC1yZXN1bHRzIGRpdi5jbC1yZXN1bHQtbGlzdCBkaXZbZGF0YS12LTUyZmQzMWMyXSB7XFxuICBkaXNwbGF5OiB0YWJsZS1yb3c7XFxuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgIzg4ODg4ODtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuZGl2LmNsLWlucHV0IGRpdi5jbC1yZXN1bHRzIGRpdi5jbC1yZXN1bHQtbGlzdCBkaXYgc3BhbltkYXRhLXYtNTJmZDMxYzJdIHtcXG4gIGRpc3BsYXk6IHRhYmxlLWNlbGw7XFxuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xcbiAgdGV4dC1hbGlnbjogbGVmdDtcXG4gIHBhZGRpbmc6IDAuNWVtIDAuMjVlbTtcXG59XFxuZGl2LmNsLWlucHV0IGRpdi5jbC1yZXN1bHRzIGRpdi5jbC1yZXN1bHQtbGlzdCBkaXYgc3BhbiBhW2RhdGEtdi01MmZkMzFjMl0ge1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgY29sb3I6IGJsYWNrO1xcbn1cXG5kaXYuY2wtaW5wdXQgZGl2LmNsLXJlc3VsdHMgZGl2LmNsLXJlc3VsdC1saXN0IGRpdiBzcGFuIGFbZGF0YS12LTUyZmQzMWMyXTpob3ZlciB7XFxuICBjb2xvcjogIzg4ODg4ODtcXG59XFxuZGl2LmNsLWlucHV0IGRpdi5jbC1yZXN1bHRzIGRpdi5jbC1yZXN1bHQtbGlzdCBkaXYgc3BhbltkYXRhLXYtNTJmZDMxYzJdOmZpcnN0LWNoaWxkIHtcXG4gIGZvbnQtc3R5bGU6IGl0YWxpYztcXG59XFxuZGl2LmNsLWlucHV0IGRpdi5jbC1yZXN1bHRzIGRpdi5jbC1yZXN1bHQtbGlzdCBkaXYgc3BhbltkYXRhLXYtNTJmZDMxYzJdOmxhc3QtY2hpbGQge1xcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcXG4gIHdpZHRoOiA5OSU7XFxufVxcbmRpdi5jbC1pbnB1dCBkaXYuY2wtcmVzdWx0cyBkaXYuY2wtcmVzdWx0LWxpc3QgZGl2OmZpcnN0LWNoaWxkIHNwYW5bZGF0YS12LTUyZmQzMWMyXSxcXG5kaXYuY2wtaW5wdXQgZGl2LmNsLXJlc3VsdHMgZGl2LmNsLXJlc3VsdC1saXN0IGRpdjpsYXN0LWNoaWxkIHNwYW5bZGF0YS12LTUyZmQzMWMyXSB7XFxuICBwYWRkaW5nOiAwLjI1ZW0gMC4yNWVtO1xcbn1cXG5kaXYuY2wtaW5wdXQgZGl2LmNsLXJlc3VsdHMgZGl2LnN0YXRlbWVudFtkYXRhLXYtNTJmZDMxYzJdIHtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgZm9udC1zdHlsZTogaXRhbGljO1xcbn1cXG5cXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG4iLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKGZhbHNlKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcImRpdi5jbC1sdGktY29uc29sZSBsYWJlbCBzcGFuOmZpcnN0LWNoaWxkIHtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gIHdpZHRoOiAxMGVtO1xcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XFxuICBwYWRkaW5nOiAwIDAuMjVlbSAwIDA7XFxufVxcbmRpdi5jbC1sdGktY29uc29sZSBpbnB1dFt0eXBlPXRleHRdLFxcbmRpdi5jbC1sdGktY29uc29sZSBvcHRpb24ge1xcbiAgcGFkZGluZzogMXB4IDAuMjVlbTtcXG59XFxuZGl2LmNsLWx0aS1jb25zb2xlIHNlbGVjdCB7XFxuICBtaW4td2lkdGg6IDE1ZW07XFxufVxcbmRpdi5jbC1sdGktY29uc29sZSBidXR0b246ZGlzYWJsZWQge1xcbiAgY29sb3I6IGdyYXk7XFxufVxcblxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcbiIsInZhciByZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgdmFyIF92bSA9IHRoaXNcbiAgdmFyIF9oID0gX3ZtLiRjcmVhdGVFbGVtZW50XG4gIHZhciBfYyA9IF92bS5fc2VsZi5fYyB8fCBfaFxuICByZXR1cm4gX2MoXCJzcGFuXCIsIFtcbiAgICBfYyhcImRpdlwiLCB7IHN0YXRpY0NsYXNzOiBcImNsLWlucHV0XCIgfSwgW1xuICAgICAgX2MoXCJpbnB1dFwiLCB7XG4gICAgICAgIGRpcmVjdGl2ZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiBcIm1vZGVsXCIsXG4gICAgICAgICAgICByYXdOYW1lOiBcInYtbW9kZWxcIixcbiAgICAgICAgICAgIHZhbHVlOiBfdm0ucXVlcnksXG4gICAgICAgICAgICBleHByZXNzaW9uOiBcInF1ZXJ5XCJcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIGF0dHJzOiB7IHR5cGU6IFwidGV4dFwiLCBtYXhsZW5ndGg6IFwiMTUwXCIgfSxcbiAgICAgICAgZG9tUHJvcHM6IHsgdmFsdWU6IF92bS5xdWVyeSB9LFxuICAgICAgICBvbjoge1xuICAgICAgICAgIGlucHV0OiBmdW5jdGlvbigkZXZlbnQpIHtcbiAgICAgICAgICAgIGlmICgkZXZlbnQudGFyZ2V0LmNvbXBvc2luZykge1xuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF92bS5xdWVyeSA9ICRldmVudC50YXJnZXQudmFsdWVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgIF9jKFxuICAgICAgICBcImFcIixcbiAgICAgICAge1xuICAgICAgICAgIHN0YXRpY0NsYXNzOiBcInNlYXJjaGVyXCIsXG4gICAgICAgICAgb246IHtcbiAgICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbigkZXZlbnQpIHtcbiAgICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgX3ZtLmZldGNoKF92bS5xdWVyeSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFtfYyhcImltZ1wiLCB7IGF0dHJzOiB7IHNyYzogX3ZtLnNlYXJjaGVyIH0gfSldXG4gICAgICApLFxuICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgIF92bS5yZXN1bHQubGVuZ3RoID4gMCB8fCBfdm0ubm9yZXN1bHRcbiAgICAgICAgPyBfYyhcImRpdlwiLCB7IHN0YXRpY0NsYXNzOiBcImNsLXJlc3VsdHNcIiB9LCBbXG4gICAgICAgICAgICBfYyhcbiAgICAgICAgICAgICAgXCJkaXZcIixcbiAgICAgICAgICAgICAgeyBzdGF0aWNDbGFzczogXCJjbC1yZXN1bHQtbGlzdFwiIH0sXG4gICAgICAgICAgICAgIF92bS5fbChfdm0ucmVzdWx0LCBmdW5jdGlvbih1c2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9jKFxuICAgICAgICAgICAgICAgICAgXCJkaXZcIixcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICAgICAgICBjbGljazogZnVuY3Rpb24oJGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgX3ZtLnNlbGVjdFVzZXIodXNlcilcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIF9jKFwic3BhblwiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgX2MoXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogZnVuY3Rpb24oJGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3ZtLnNlbGVjdFVzZXIodXNlcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbX3ZtLl92KF92bS5fcyh1c2VyLnVzZXJJZCkpXVxuICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgICAgICAgIF9jKFwic3BhblwiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgX2MoXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogZnVuY3Rpb24oJGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3ZtLnNlbGVjdFVzZXIodXNlcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbX3ZtLl92KF92bS5fcyh1c2VyLm5hbWUpKV1cbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICBfdm0ubm9yZXN1bHRcbiAgICAgICAgICAgICAgPyBfYyhcImRpdlwiLCB7IHN0YXRpY0NsYXNzOiBcInN0YXRlbWVudFwiIH0sIFtcbiAgICAgICAgICAgICAgICAgIF92bS5fdihcIk5vIHJlc3VsdHMuLi5cIilcbiAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICA6IF92bS5fZSgpLFxuICAgICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICAgIF92bS5tb3JlXG4gICAgICAgICAgICAgID8gX2MoXCJkaXZcIiwgeyBzdGF0aWNDbGFzczogXCJzdGF0ZW1lbnRcIiB9LCBbX3ZtLl92KFwiLi4ubW9yZS4uLlwiKV0pXG4gICAgICAgICAgICAgIDogX3ZtLl9lKClcbiAgICAgICAgICBdKVxuICAgICAgICA6IF92bS5fZSgpXG4gICAgXSksXG4gICAgX3ZtLl92KFwiIFwiKSxcbiAgICBfYyhcbiAgICAgIFwiYVwiLFxuICAgICAge1xuICAgICAgICBvbjoge1xuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbigkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICByZXR1cm4gX3ZtLmNsZWFyKCRldmVudClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBbX2MoXCJpbWdcIiwgeyBhdHRyczogeyBzcmM6IF92bS5kZWxldGVyIH0gfSldXG4gICAgKVxuICBdKVxufVxudmFyIHN0YXRpY1JlbmRlckZucyA9IFtdXG5yZW5kZXIuX3dpdGhTdHJpcHBlZCA9IHRydWVcblxuZXhwb3J0IHsgcmVuZGVyLCBzdGF0aWNSZW5kZXJGbnMgfSIsInZhciByZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgdmFyIF92bSA9IHRoaXNcbiAgdmFyIF9oID0gX3ZtLiRjcmVhdGVFbGVtZW50XG4gIHZhciBfYyA9IF92bS5fc2VsZi5fYyB8fCBfaFxuICByZXR1cm4gX2MoXCJkaXZcIiwgeyBzdGF0aWNDbGFzczogXCJjb250ZW50IGNsLWx0aS1jb25zb2xlXCIgfSwgW1xuICAgIF9jKFwiZGl2XCIsIHsgc3RhdGljQ2xhc3M6IFwiZnVsbFwiIH0sIFtcbiAgICAgIF9jKFwicFwiLCBbXG4gICAgICAgIF9jKFwibGFiZWxcIiwgW1xuICAgICAgICAgIF9jKFwic3BhblwiLCBbX3ZtLl92KFwiQXNzaWdubWVudDogXCIpXSksXG4gICAgICAgICAgX2MoXG4gICAgICAgICAgICBcInNlbGVjdFwiLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBkaXJlY3RpdmVzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgbmFtZTogXCJtb2RlbFwiLFxuICAgICAgICAgICAgICAgICAgcmF3TmFtZTogXCJ2LW1vZGVsXCIsXG4gICAgICAgICAgICAgICAgICB2YWx1ZTogX3ZtLnNlbGVjdGVkQXNzaWdubWVudCxcbiAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb246IFwic2VsZWN0ZWRBc3NpZ25tZW50XCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgY2hhbmdlOiBmdW5jdGlvbigkZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgIHZhciAkJHNlbGVjdGVkVmFsID0gQXJyYXkucHJvdG90eXBlLmZpbHRlclxuICAgICAgICAgICAgICAgICAgICAuY2FsbCgkZXZlbnQudGFyZ2V0Lm9wdGlvbnMsIGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gby5zZWxlY3RlZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsID0gXCJfdmFsdWVcIiBpbiBvID8gby5fdmFsdWUgOiBvLnZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgX3ZtLnNlbGVjdGVkQXNzaWdubWVudCA9ICRldmVudC50YXJnZXQubXVsdGlwbGVcbiAgICAgICAgICAgICAgICAgICAgPyAkJHNlbGVjdGVkVmFsXG4gICAgICAgICAgICAgICAgICAgIDogJCRzZWxlY3RlZFZhbFswXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgX2MoXCJvcHRpb25cIiwgW192bS5fdihcImFueVwiKV0pLFxuICAgICAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgICAgICBfdm0uX2woX3ZtLmFzc2lnblRhZ3MsIGZ1bmN0aW9uKGFwcCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfYyhcIm9wdGlvblwiLCBbX3ZtLl92KF92bS5fcyhhcHApKV0pXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgMlxuICAgICAgICAgIClcbiAgICAgICAgXSlcbiAgICAgIF0pLFxuICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgIF9jKFwicFwiLCBbXG4gICAgICAgIF9jKFwibGFiZWxcIiwgW1xuICAgICAgICAgIF9jKFwic3BhblwiLCBbX3ZtLl92KFwiR3JhZGUgaXRlbTogXCIpXSksXG4gICAgICAgICAgX2MoXG4gICAgICAgICAgICBcInNlbGVjdFwiLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBkaXJlY3RpdmVzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgbmFtZTogXCJtb2RlbFwiLFxuICAgICAgICAgICAgICAgICAgcmF3TmFtZTogXCJ2LW1vZGVsXCIsXG4gICAgICAgICAgICAgICAgICB2YWx1ZTogX3ZtLnNlbGVjdGVkR3JhZGUsXG4gICAgICAgICAgICAgICAgICBleHByZXNzaW9uOiBcInNlbGVjdGVkR3JhZGVcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICBjaGFuZ2U6IGZ1bmN0aW9uKCRldmVudCkge1xuICAgICAgICAgICAgICAgICAgdmFyICQkc2VsZWN0ZWRWYWwgPSBBcnJheS5wcm90b3R5cGUuZmlsdGVyXG4gICAgICAgICAgICAgICAgICAgIC5jYWxsKCRldmVudC50YXJnZXQub3B0aW9ucywgZnVuY3Rpb24obykge1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvLnNlbGVjdGVkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24obykge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWwgPSBcIl92YWx1ZVwiIGluIG8gPyBvLl92YWx1ZSA6IG8udmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICBfdm0uc2VsZWN0ZWRHcmFkZSA9ICRldmVudC50YXJnZXQubXVsdGlwbGVcbiAgICAgICAgICAgICAgICAgICAgPyAkJHNlbGVjdGVkVmFsXG4gICAgICAgICAgICAgICAgICAgIDogJCRzZWxlY3RlZFZhbFswXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgX2MoXCJvcHRpb25cIiwgW192bS5fdihcImFueVwiKV0pLFxuICAgICAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgICAgICBfYyhcIm9wdGlvblwiLCBbX3ZtLl92KFwibm9uZVwiKV0pLFxuICAgICAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgICAgICBfdm0uX2woX3ZtLmdyYWRlVGFncywgZnVuY3Rpb24oYXBwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9jKFwib3B0aW9uXCIsIFtfdm0uX3YoX3ZtLl9zKGFwcCkpXSlcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAyXG4gICAgICAgICAgKVxuICAgICAgICBdKVxuICAgICAgXSksXG4gICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgX2MoXCJwXCIsIFtcbiAgICAgICAgX2MoXG4gICAgICAgICAgXCJsYWJlbFwiLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIF9jKFwic3BhblwiLCBbX3ZtLl92KFwiTWVtYmVyOiBcIildKSxcbiAgICAgICAgICAgIF9jKFwidXNlci1zZWxlY3RvclwiLCB7IGF0dHJzOiB7IHNlbGVjdGVkOiBfdm0uc2VsZWN0ZWQgfSB9KVxuICAgICAgICAgIF0sXG4gICAgICAgICAgMVxuICAgICAgICApXG4gICAgICBdKSxcbiAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICBfYyhcInBcIiwgeyBzdGF0aWNDbGFzczogXCJjZW50ZXJcIiB9LCBbXG4gICAgICAgIF9jKFxuICAgICAgICAgIFwiYnV0dG9uXCIsXG4gICAgICAgICAge1xuICAgICAgICAgICAgYXR0cnM6IHsgZGlzYWJsZWQ6IF92bS51c2VyID09PSBudWxsIH0sXG4gICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICBjbGljazogZnVuY3Rpb24oJGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICBfdm0ucXVlcnkoKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBbX3ZtLl92KFwiUXVlcnlcIildXG4gICAgICAgIClcbiAgICAgIF0pLFxuICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgIF92bS5mZXRjaGVkXG4gICAgICAgID8gX2MoXCJkaXZcIiwgW1xuICAgICAgICAgICAgX3ZtLnJlc3VsdHMubGVuZ3RoID4gMFxuICAgICAgICAgICAgICA/IF9jKFxuICAgICAgICAgICAgICAgICAgXCJ0YWJsZVwiLFxuICAgICAgICAgICAgICAgICAgeyBzdGF0aWNDbGFzczogXCJzbWFsbFwiIH0sXG4gICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIF92bS5fbSgwKSxcbiAgICAgICAgICAgICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICAgICAgICAgICAgX3ZtLl9sKF92bS5yZXN1bHRzLCBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2MoXCJ0clwiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICBfYyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6IHJlc3VsdC51c2VyLnVzZXIubGVuZ3RoID4gMTAgPyBcInNtYWxsXCIgOiBcIlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFtfdm0uX3YoX3ZtLl9zKHJlc3VsdC51c2VyLnVzZXIpKV1cbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgX2MoXCJ0ZFwiLCBbX3ZtLl92KF92bS5fcyhyZXN1bHQudXNlci5uYW1lKSldKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBfYyhcInRkXCIsIFtfdm0uX3YoX3ZtLl9zKHJlc3VsdC5hc3NpZ25UYWcpKV0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jKFwidGRcIiwgW192bS5fdihfdm0uX3MocmVzdWx0LmdyYWRlVGFnKSldKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBfYyhcInRkXCIsIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgX2MoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaHJlZjogX3ZtLnRvVmlldyArIF92bS5wYXRoKHJlc3VsdCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogXCJfZmlsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbX2MoXCJpbWdcIiwgeyBhdHRyczogeyBzcmM6IF92bS50b1ZpZXdJbWcgfSB9KV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgX2MoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHsgaHJlZjogX3ZtLnRvRG93bmxvYWQgKyBfdm0ucGF0aChyZXN1bHQpIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtfYyhcImltZ1wiLCB7IGF0dHJzOiB7IHNyYzogX3ZtLnRvRG93bmxvYWRJbWcgfSB9KV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICAgICAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgX2MoXCJ0ZFwiLCB7IHN0YXRpY0NsYXNzOiBcInNtYWxsXCIgfSwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICBfdm0uX3YoX3ZtLl9zKHJlc3VsdC5jcmVhdGVkU3RyKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jKFwidGRcIiwgeyBzdGF0aWNDbGFzczogXCJzbWFsbFwiIH0sIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgX3ZtLl92KF92bS5fcyhyZXN1bHQubW9kaWZpZWRTdHIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIDJcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIDogX3ZtLl9lKCksXG4gICAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgICAgX3ZtLnJlc3VsdHMubGVuZ3RoID09PSAwXG4gICAgICAgICAgICAgID8gX2MoXCJwXCIsIHsgc3RhdGljQ2xhc3M6IFwiY2VudGVyYm94IHNlY29uZGIgY2VudGVyXCIgfSwgW1xuICAgICAgICAgICAgICAgICAgX3ZtLl92KFwiTm8gZmlsZXMuLi5cIilcbiAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICA6IF92bS5fZSgpXG4gICAgICAgICAgXSlcbiAgICAgICAgOiBfdm0uX2UoKVxuICAgIF0pXG4gIF0pXG59XG52YXIgc3RhdGljUmVuZGVyRm5zID0gW1xuICBmdW5jdGlvbigpIHtcbiAgICB2YXIgX3ZtID0gdGhpc1xuICAgIHZhciBfaCA9IF92bS4kY3JlYXRlRWxlbWVudFxuICAgIHZhciBfYyA9IF92bS5fc2VsZi5fYyB8fCBfaFxuICAgIHJldHVybiBfYyhcInRyXCIsIFtcbiAgICAgIF9jKFwidGhcIiwgW192bS5fdihcIlVzZXJcIildKSxcbiAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICBfYyhcInRoXCIsIFtfdm0uX3YoXCJOYW1lXCIpXSksXG4gICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgX2MoXCJ0aFwiLCBbX3ZtLl92KFwiQXNzaWduXCIpXSksXG4gICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgX2MoXCJ0aFwiLCBbX3ZtLl92KFwiSXRlbVwiKV0pLFxuICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgIF9jKFwidGhcIiwgW192bS5fdihcIkZpbGVcIildKSxcbiAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICBfYyhcInRoXCIsIFtfdm0uX3YoXCJDcmVhdGVkXCIpXSksXG4gICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgX2MoXCJ0aFwiLCBbX3ZtLl92KFwiTW9kaWZpZWRcIildKVxuICAgIF0pXG4gIH1cbl1cbnJlbmRlci5fd2l0aFN0cmlwcGVkID0gdHJ1ZVxuXG5leHBvcnQgeyByZW5kZXIsIHN0YXRpY1JlbmRlckZucyB9IiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9sb2FkZXJzL3N0eWxlUG9zdExvYWRlci5qcyEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVzb2x2ZS11cmwtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzP3NvdXJjZU1hcCEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvaW5kZXguanM/P3Z1ZS1sb2FkZXItb3B0aW9ucyEuL01lbWJlclNlbGVjdG9yVnVlLnZ1ZT92dWUmdHlwZT1zdHlsZSZpbmRleD0wJmlkPTUyZmQzMWMyJmxhbmc9c2NzcyZzY29wZWQ9dHJ1ZSZcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIGFkZCA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlc0NsaWVudC5qc1wiKS5kZWZhdWx0XG52YXIgdXBkYXRlID0gYWRkKFwiYTE3ZDcwNTRcIiwgY29udGVudCwgZmFsc2UsIHt9KTtcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcbiAvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuIGlmKCFjb250ZW50LmxvY2Fscykge1xuICAgbW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9sb2FkZXJzL3N0eWxlUG9zdExvYWRlci5qcyEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVzb2x2ZS11cmwtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzP3NvdXJjZU1hcCEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvaW5kZXguanM/P3Z1ZS1sb2FkZXItb3B0aW9ucyEuL01lbWJlclNlbGVjdG9yVnVlLnZ1ZT92dWUmdHlwZT1zdHlsZSZpbmRleD0wJmlkPTUyZmQzMWMyJmxhbmc9c2NzcyZzY29wZWQ9dHJ1ZSZcIiwgZnVuY3Rpb24oKSB7XG4gICAgIHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL2xvYWRlcnMvc3R5bGVQb3N0TG9hZGVyLmpzIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZXNvbHZlLXVybC1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/c291cmNlTWFwIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9pbmRleC5qcz8/dnVlLWxvYWRlci1vcHRpb25zIS4vTWVtYmVyU2VsZWN0b3JWdWUudnVlP3Z1ZSZ0eXBlPXN0eWxlJmluZGV4PTAmaWQ9NTJmZDMxYzImbGFuZz1zY3NzJnNjb3BlZD10cnVlJlwiKTtcbiAgICAgaWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG4gICAgIHVwZGF0ZShuZXdDb250ZW50KTtcbiAgIH0pO1xuIH1cbiAvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG4gbW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59IiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9sb2FkZXJzL3N0eWxlUG9zdExvYWRlci5qcyEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVzb2x2ZS11cmwtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzP3NvdXJjZU1hcCEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvaW5kZXguanM/P3Z1ZS1sb2FkZXItb3B0aW9ucyEuL0x0aUNvbXBvbmVudC52dWU/dnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZsYW5nPXNjc3MmXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciBhZGQgPSByZXF1aXJlKFwiIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXNDbGllbnQuanNcIikuZGVmYXVsdFxudmFyIHVwZGF0ZSA9IGFkZChcImExOTMzM2UwXCIsIGNvbnRlbnQsIGZhbHNlLCB7fSk7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG4gLy8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3NcbiBpZighY29udGVudC5sb2NhbHMpIHtcbiAgIG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvbG9hZGVycy9zdHlsZVBvc3RMb2FkZXIuanMhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Jlc29sdmUtdXJsLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz9zb3VyY2VNYXAhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL2luZGV4LmpzPz92dWUtbG9hZGVyLW9wdGlvbnMhLi9MdGlDb21wb25lbnQudnVlP3Z1ZSZ0eXBlPXN0eWxlJmluZGV4PTAmbGFuZz1zY3NzJlwiLCBmdW5jdGlvbigpIHtcbiAgICAgdmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvbG9hZGVycy9zdHlsZVBvc3RMb2FkZXIuanMhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Jlc29sdmUtdXJsLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz9zb3VyY2VNYXAhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL2luZGV4LmpzPz92dWUtbG9hZGVyLW9wdGlvbnMhLi9MdGlDb21wb25lbnQudnVlP3Z1ZSZ0eXBlPXN0eWxlJmluZGV4PTAmbGFuZz1zY3NzJlwiKTtcbiAgICAgaWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG4gICAgIHVwZGF0ZShuZXdDb250ZW50KTtcbiAgIH0pO1xuIH1cbiAvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG4gbW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59IiwiLyoqXHJcbiAqIEBmaWxlXHJcbiAqIEV4cG9ydCBvZiBNZW1iZXJTZWxlY3RvclZ1ZSBmb3IgZXh0ZXJuYWwgdXNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBNZW1iZXJTZWxlY3RvclZ1ZSBmcm9tICcuL1V0aWwvTWVtYmVyU2VsZWN0b3JWdWUudnVlJztcclxuZXhwb3J0IHtNZW1iZXJTZWxlY3RvclZ1ZX07XHJcbiIsImltcG9ydCB7IHJlbmRlciwgc3RhdGljUmVuZGVyRm5zIH0gZnJvbSBcIi4vTWVtYmVyU2VsZWN0b3JWdWUudnVlP3Z1ZSZ0eXBlPXRlbXBsYXRlJmlkPTUyZmQzMWMyJnNjb3BlZD10cnVlJlwiXG5pbXBvcnQgc2NyaXB0IGZyb20gXCIuL01lbWJlclNlbGVjdG9yVnVlLnZ1ZT92dWUmdHlwZT1zY3JpcHQmbGFuZz1qcyZcIlxuZXhwb3J0ICogZnJvbSBcIi4vTWVtYmVyU2VsZWN0b3JWdWUudnVlP3Z1ZSZ0eXBlPXNjcmlwdCZsYW5nPWpzJlwiXG5pbXBvcnQgc3R5bGUwIGZyb20gXCIuL01lbWJlclNlbGVjdG9yVnVlLnZ1ZT92dWUmdHlwZT1zdHlsZSZpbmRleD0wJmlkPTUyZmQzMWMyJmxhbmc9c2NzcyZzY29wZWQ9dHJ1ZSZcIlxuXG5cbi8qIG5vcm1hbGl6ZSBjb21wb25lbnQgKi9cbmltcG9ydCBub3JtYWxpemVyIGZyb20gXCIhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3J1bnRpbWUvY29tcG9uZW50Tm9ybWFsaXplci5qc1wiXG52YXIgY29tcG9uZW50ID0gbm9ybWFsaXplcihcbiAgc2NyaXB0LFxuICByZW5kZXIsXG4gIHN0YXRpY1JlbmRlckZucyxcbiAgZmFsc2UsXG4gIG51bGwsXG4gIFwiNTJmZDMxYzJcIixcbiAgbnVsbFxuICBcbilcblxuLyogaG90IHJlbG9hZCAqL1xuaWYgKG1vZHVsZS5ob3QpIHtcbiAgdmFyIGFwaSA9IHJlcXVpcmUoXCJDOlxcXFxVc2Vyc1xcXFxjaGFybFxcXFxEb2N1bWVudHNcXFxcQ2xhc3Nlc1xcXFxDU0UzMjBcXFxcd2ViXFxcXG5vZGVfbW9kdWxlc1xcXFx2dWUtaG90LXJlbG9hZC1hcGlcXFxcZGlzdFxcXFxpbmRleC5qc1wiKVxuICBhcGkuaW5zdGFsbChyZXF1aXJlKCd2dWUnKSlcbiAgaWYgKGFwaS5jb21wYXRpYmxlKSB7XG4gICAgbW9kdWxlLmhvdC5hY2NlcHQoKVxuICAgIGlmICghbW9kdWxlLmhvdC5kYXRhKSB7XG4gICAgICBhcGkuY3JlYXRlUmVjb3JkKCc1MmZkMzFjMicsIGNvbXBvbmVudC5vcHRpb25zKVxuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVsb2FkKCc1MmZkMzFjMicsIGNvbXBvbmVudC5vcHRpb25zKVxuICAgIH1cbiAgICBtb2R1bGUuaG90LmFjY2VwdChcIi4vTWVtYmVyU2VsZWN0b3JWdWUudnVlP3Z1ZSZ0eXBlPXRlbXBsYXRlJmlkPTUyZmQzMWMyJnNjb3BlZD10cnVlJlwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICBhcGkucmVyZW5kZXIoJzUyZmQzMWMyJywge1xuICAgICAgICByZW5kZXI6IHJlbmRlcixcbiAgICAgICAgc3RhdGljUmVuZGVyRm5zOiBzdGF0aWNSZW5kZXJGbnNcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxufVxuY29tcG9uZW50Lm9wdGlvbnMuX19maWxlID0gXCJ2ZW5kb3IvY2wvY291cnNlL2pzL1V0aWwvTWVtYmVyU2VsZWN0b3JWdWUudnVlXCJcbmV4cG9ydCBkZWZhdWx0IGNvbXBvbmVudC5leHBvcnRzIiwiaW1wb3J0IG1vZCBmcm9tIFwiLSEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0yIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9pbmRleC5qcz8/dnVlLWxvYWRlci1vcHRpb25zIS4vTWVtYmVyU2VsZWN0b3JWdWUudnVlP3Z1ZSZ0eXBlPXNjcmlwdCZsYW5nPWpzJlwiOyBleHBvcnQgZGVmYXVsdCBtb2Q7IGV4cG9ydCAqIGZyb20gXCItIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTIhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL2luZGV4LmpzPz92dWUtbG9hZGVyLW9wdGlvbnMhLi9NZW1iZXJTZWxlY3RvclZ1ZS52dWU/dnVlJnR5cGU9c2NyaXB0Jmxhbmc9anMmXCIiLCJpbXBvcnQgbW9kIGZyb20gXCItIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtc3R5bGUtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9sb2FkZXJzL3N0eWxlUG9zdExvYWRlci5qcyEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVzb2x2ZS11cmwtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzP3NvdXJjZU1hcCEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvaW5kZXguanM/P3Z1ZS1sb2FkZXItb3B0aW9ucyEuL01lbWJlclNlbGVjdG9yVnVlLnZ1ZT92dWUmdHlwZT1zdHlsZSZpbmRleD0wJmlkPTUyZmQzMWMyJmxhbmc9c2NzcyZzY29wZWQ9dHJ1ZSZcIjsgZXhwb3J0IGRlZmF1bHQgbW9kOyBleHBvcnQgKiBmcm9tIFwiLSEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLXN0eWxlLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvbG9hZGVycy9zdHlsZVBvc3RMb2FkZXIuanMhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Jlc29sdmUtdXJsLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz9zb3VyY2VNYXAhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL2luZGV4LmpzPz92dWUtbG9hZGVyLW9wdGlvbnMhLi9NZW1iZXJTZWxlY3RvclZ1ZS52dWU/dnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZpZD01MmZkMzFjMiZsYW5nPXNjc3Mmc2NvcGVkPXRydWUmXCIiLCJleHBvcnQgKiBmcm9tIFwiLSEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvbG9hZGVycy90ZW1wbGF0ZUxvYWRlci5qcz8/dnVlLWxvYWRlci1vcHRpb25zIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9pbmRleC5qcz8/dnVlLWxvYWRlci1vcHRpb25zIS4vTWVtYmVyU2VsZWN0b3JWdWUudnVlP3Z1ZSZ0eXBlPXRlbXBsYXRlJmlkPTUyZmQzMWMyJnNjb3BlZD10cnVlJlwiIiwiaW1wb3J0IHsgcmVuZGVyLCBzdGF0aWNSZW5kZXJGbnMgfSBmcm9tIFwiLi9MdGlDb21wb25lbnQudnVlP3Z1ZSZ0eXBlPXRlbXBsYXRlJmlkPTY4Mzk5YTYyJlwiXG5pbXBvcnQgc2NyaXB0IGZyb20gXCIuL0x0aUNvbXBvbmVudC52dWU/dnVlJnR5cGU9c2NyaXB0Jmxhbmc9anMmXCJcbmV4cG9ydCAqIGZyb20gXCIuL0x0aUNvbXBvbmVudC52dWU/dnVlJnR5cGU9c2NyaXB0Jmxhbmc9anMmXCJcbmltcG9ydCBzdHlsZTAgZnJvbSBcIi4vTHRpQ29tcG9uZW50LnZ1ZT92dWUmdHlwZT1zdHlsZSZpbmRleD0wJmxhbmc9c2NzcyZcIlxuXG5cbi8qIG5vcm1hbGl6ZSBjb21wb25lbnQgKi9cbmltcG9ydCBub3JtYWxpemVyIGZyb20gXCIhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3J1bnRpbWUvY29tcG9uZW50Tm9ybWFsaXplci5qc1wiXG52YXIgY29tcG9uZW50ID0gbm9ybWFsaXplcihcbiAgc2NyaXB0LFxuICByZW5kZXIsXG4gIHN0YXRpY1JlbmRlckZucyxcbiAgZmFsc2UsXG4gIG51bGwsXG4gIG51bGwsXG4gIG51bGxcbiAgXG4pXG5cbi8qIGhvdCByZWxvYWQgKi9cbmlmIChtb2R1bGUuaG90KSB7XG4gIHZhciBhcGkgPSByZXF1aXJlKFwiQzpcXFxcVXNlcnNcXFxcY2hhcmxcXFxcRG9jdW1lbnRzXFxcXENsYXNzZXNcXFxcQ1NFMzIwXFxcXHdlYlxcXFxub2RlX21vZHVsZXNcXFxcdnVlLWhvdC1yZWxvYWQtYXBpXFxcXGRpc3RcXFxcaW5kZXguanNcIilcbiAgYXBpLmluc3RhbGwocmVxdWlyZSgndnVlJykpXG4gIGlmIChhcGkuY29tcGF0aWJsZSkge1xuICAgIG1vZHVsZS5ob3QuYWNjZXB0KClcbiAgICBpZiAoIW1vZHVsZS5ob3QuZGF0YSkge1xuICAgICAgYXBpLmNyZWF0ZVJlY29yZCgnNjgzOTlhNjInLCBjb21wb25lbnQub3B0aW9ucylcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbG9hZCgnNjgzOTlhNjInLCBjb21wb25lbnQub3B0aW9ucylcbiAgICB9XG4gICAgbW9kdWxlLmhvdC5hY2NlcHQoXCIuL0x0aUNvbXBvbmVudC52dWU/dnVlJnR5cGU9dGVtcGxhdGUmaWQ9NjgzOTlhNjImXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGFwaS5yZXJlbmRlcignNjgzOTlhNjInLCB7XG4gICAgICAgIHJlbmRlcjogcmVuZGVyLFxuICAgICAgICBzdGF0aWNSZW5kZXJGbnM6IHN0YXRpY1JlbmRlckZuc1xuICAgICAgfSlcbiAgICB9KVxuICB9XG59XG5jb21wb25lbnQub3B0aW9ucy5fX2ZpbGUgPSBcInZlbmRvci9jbC9sdGkvanMvQ29uc29sZS9MdGlDb21wb25lbnQudnVlXCJcbmV4cG9ydCBkZWZhdWx0IGNvbXBvbmVudC5leHBvcnRzIiwiaW1wb3J0IG1vZCBmcm9tIFwiLSEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0yIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9pbmRleC5qcz8/dnVlLWxvYWRlci1vcHRpb25zIS4vTHRpQ29tcG9uZW50LnZ1ZT92dWUmdHlwZT1zY3JpcHQmbGFuZz1qcyZcIjsgZXhwb3J0IGRlZmF1bHQgbW9kOyBleHBvcnQgKiBmcm9tIFwiLSEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0yIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9pbmRleC5qcz8/dnVlLWxvYWRlci1vcHRpb25zIS4vTHRpQ29tcG9uZW50LnZ1ZT92dWUmdHlwZT1zY3JpcHQmbGFuZz1qcyZcIiIsImltcG9ydCBtb2QgZnJvbSBcIi0hLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1zdHlsZS1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL2xvYWRlcnMvc3R5bGVQb3N0TG9hZGVyLmpzIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZXNvbHZlLXVybC1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/c291cmNlTWFwIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9pbmRleC5qcz8/dnVlLWxvYWRlci1vcHRpb25zIS4vTHRpQ29tcG9uZW50LnZ1ZT92dWUmdHlwZT1zdHlsZSZpbmRleD0wJmxhbmc9c2NzcyZcIjsgZXhwb3J0IGRlZmF1bHQgbW9kOyBleHBvcnQgKiBmcm9tIFwiLSEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLXN0eWxlLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvbG9hZGVycy9zdHlsZVBvc3RMb2FkZXIuanMhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Jlc29sdmUtdXJsLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz9zb3VyY2VNYXAhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL2luZGV4LmpzPz92dWUtbG9hZGVyLW9wdGlvbnMhLi9MdGlDb21wb25lbnQudnVlP3Z1ZSZ0eXBlPXN0eWxlJmluZGV4PTAmbGFuZz1zY3NzJlwiIiwiZXhwb3J0ICogZnJvbSBcIi0hLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL2xvYWRlcnMvdGVtcGxhdGVMb2FkZXIuanM/P3Z1ZS1sb2FkZXItb3B0aW9ucyEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvaW5kZXguanM/P3Z1ZS1sb2FkZXItb3B0aW9ucyEuL0x0aUNvbXBvbmVudC52dWU/dnVlJnR5cGU9dGVtcGxhdGUmaWQ9NjgzOTlhNjImXCIiLCIvKipcclxuICogQGZpbGVcclxuICogTFRJIGNvbnNvbGUgY29tcG9uZW50c1xyXG4gKi9cclxuXHJcbmltcG9ydCB7VXNlcn0gZnJvbSAndXNlcnMtY2wvanMvVXNlcnMvVXNlcic7XHJcbmltcG9ydCBMdGlDb21wb25lbnQgZnJvbSAnLi9MdGlDb21wb25lbnQudnVlJztcclxuXHJcbmV4cG9ydCBjb25zdCBMdGlDb25zb2xlID0gZnVuY3Rpb24gKHNpdGUpIHtcclxuICAgIGNvbnN0IENvbnNvbGUgPSBzaXRlLmNvbnNvbGU7XHJcblxyXG4gICAgQ29uc29sZS50YWJsZXMuYWRkKHtcclxuICAgICAgICB0aXRsZTogJ0xUSScsXHJcbiAgICAgICAgb3JkZXI6IDkwLFxyXG4gICAgICAgIGFwaTogJy9hcGkvbHRpL3RhYmxlcydcclxuICAgIH0pO1xyXG5cclxuICAgIENvbnNvbGUuY29tcG9uZW50cy5hZGRPcHRpb24oe1xyXG4gICAgICAgIGF0TGVhc3Q6IHt0YWc6ICdsdGktdmlldy1zdWJtaXNzaW9ucycsIGRlZmF1bHQ6IFVzZXIuU1RBRkZ9LFxyXG4gICAgICAgIHBhZ2U6IHt0aXRsZTogJ01haW4nLCByb3V0ZTogJycsIG9yZGVyOiAxfSxcclxuICAgICAgICBzZWN0aW9uOiB7dGl0bGU6ICdMdGknLCBvcmRlcjogMjB9LFxyXG4gICAgICAgIHRpdGxlOiAnTFRJIFN1Ym1pc3Npb25zJyxcclxuICAgICAgICBvcmRlcjogMSxcclxuICAgICAgICByb3V0ZTogJy9sdGknLFxyXG4gICAgICAgIHJvdXRlczogW1xyXG4gICAgICAgICAgICB7cm91dGU6ICcvbHRpJywgY29tcG9uZW50OiBMdGlDb21wb25lbnR9XHJcbiAgICAgICAgXVxyXG4gICAgfSk7XHJcblxyXG59XHJcbiIsIi8qKlxyXG4gKiBAZmlsZVxyXG4gKiBDb3Vyc2UgY29uc29sZSBlbnRyeSBwb2ludC5cclxuICovXHJcblxyXG5pbXBvcnQge0x0aUNvbnNvbGV9IGZyb20gJy4vTHRpQ29uc29sZSc7XHJcblxyXG5uZXcgTHRpQ29uc29sZShTaXRlLlNpdGUpO1xyXG4iLCIvKipcclxuICogQGZpbGVcclxuICogUmVwcmVzZW50cyBhIHVzZXIgaW4gdGhlIHN5c3RlbVxyXG4gKi9cclxuXHJcbmxldCBVc2VyID0gZnVuY3Rpb24oanNvbikge1xyXG5cclxuICAgIC8vLyBUaGUgdXNlciByb2xlIC0gbG9jYWwgc28gd2UgY2FuIHByb3RlY3QgaXQgd2l0aCBnZXR0ZXIvc2V0dGVyXHJcbiAgICBsZXQgcm9sZSA9ICdHJztcclxuXHJcbiAgICAvLyBJbnN0YWxsZWQgbWVtYmVyc2hpcFxyXG4gICAgbGV0IG1lbWJlciA9IG51bGw7XHJcblxyXG4gICAgaWYoanNvbiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgaWYodHlwZW9mKGpzb24pID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBqc29uID0gSlNPTi5wYXJzZShqc29uKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pZCA9IGpzb24uaWQ7XHJcbiAgICAgICAgcm9sZSA9IGpzb24ucm9sZTtcclxuICAgICAgICB0aGlzLm5hbWUgPSBqc29uLm5hbWU7XHJcbiAgICAgICAgdGhpcy5lbWFpbCA9IGpzb24uZW1haWw7XHJcbiAgICAgICAgdGhpcy51c2VySWQgPSBqc29uLnVzZXI7XHJcblxyXG4gICAgICAgIC8vIEluc3RhbGxlZCBtZW1iZXJzaGlwXHJcbiAgICAgICAgbWVtYmVyID0gVXNlci5pbnN0YW50aWF0ZU1lbWJlcihqc29uKTtcclxuICAgICAgICBpZihtZW1iZXIgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgbWVtYmVyLnVzZXIgPSB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuaWQgPSAwO1xyXG4gICAgICAgIHJvbGUgPSAnRyc7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gJyc7XHJcbiAgICAgICAgdGhpcy5lbWFpbCA9ICcnO1xyXG4gICAgICAgIHRoaXMudXNlcklkID0gJyc7XHJcbiAgICB9XHJcblxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdtZW1iZXInLCB7XHJcbiAgICAgICAgZ2V0KCkge3JldHVybiBtZW1iZXJ9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybiB0aGUgZWZmZWN0aXZlIHJvbGUgZm9yIHRoZSB1c2VyLlxyXG4gICAgICogVGhpcyBpcyB0aGUgdXNlcidzIHJvbGUgdW5sZXNzIHRoZSB1c2VyXHJcbiAgICAgKiBoYXMgYSBtZW1iZXJzaGlwLCBpbiB3aGljaCBjYXNlIGl0IGlzIHRoZVxyXG4gICAgICogbWVtYmVyc2hpcCByb2xlLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIHRoaXMucm9sZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmKG1lbWJlciAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbWVtYmVyLnJvbGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByb2xlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2V0VXNlclJvbGUgPSBmdW5jdGlvbihfcm9sZSkge1xyXG4gICAgICAgIHJvbGUgPSBfcm9sZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVzZXJSb2xlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHJvbGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgdGhlIG1lbWJlcnNoaXAgZm9yIHRoaXMgdXNlclxyXG4gICAgICogQHBhcmFtIE1lbWJlcnNoaXAgbWVtYmVyXHJcbiAgICAgKi9cclxuICAgIHRoaXMuc2V0TWVtYmVyID0gZnVuY3Rpb24oX21lbWJlcikge1xyXG4gICAgICAgIG1lbWJlciA9IF9tZW1iZXI7XHJcbiAgICAgICAgaWYobWVtYmVyICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIG1lbWJlci51c2VyID0gdGhpcztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5Vc2VyLkdVRVNUID0gJ0cnO1xyXG5Vc2VyLlVTRVIgPSAnVSc7XHJcblVzZXIuU1RBRkYgPSAnUyc7XHJcblVzZXIuQURNSU4gPSAnQSc7XHJcblxyXG5cclxuVXNlci5nZXRVc2VyUm9sZXMgPSBmdW5jdGlvbigpIHtcclxuICAgIGxldCByb2xlcyA9IHt9O1xyXG4gICAgcm9sZXNbVXNlci5HVUVTVF0gPSB7bmFtZTogJ0d1ZXN0JywgcHJpb3JpdHk6IDF9O1xyXG4gICAgcm9sZXNbVXNlci5VU0VSXSA9IHtuYW1lOiAnVXNlcicsIHByaW9yaXR5OiAyfTtcclxuICAgIHJvbGVzW1VzZXIuU1RBRkZdID0ge25hbWU6ICdTdGFmZicsIHByaW9yaXR5OiAzfTtcclxuICAgIHJvbGVzW1VzZXIuQURNSU5dID0ge25hbWU6ICdBZG1pbicsIHByaW9yaXR5OiA0fTtcclxuXHJcbiAgICByZXR1cm4gcm9sZXM7XHJcbn1cclxuXHJcblVzZXIucHJvdG90eXBlLmdldFVzZXJSb2xlcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIFVzZXIuZ2V0VXNlclJvbGVzKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgdGhlIHJvbGVzIGZvciB0aGlzIHVzZXIuIE1lbWJlcnNoaXAgcm9sZXMgdGFrZSBwcmlvcml0eVxyXG4gKiBvdmVyIHJvbGVzIGZvciBqdXN0IGEgdXNlciB3aG8gaXMgbm90IGEgbWVtYmVyLlxyXG4gKi9cclxuVXNlci5wcm90b3R5cGUuZ2V0Um9sZXMgPSBmdW5jdGlvbigpIHtcclxuICAgIGxldCBtZW1iZXIgPSB0aGlzLm1lbWJlcjtcclxuICAgIGlmKG1lbWJlciAhPT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiBtZW1iZXIuZ2V0Um9sZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gVXNlci5nZXRVc2VyUm9sZXMoKTtcclxufVxyXG5cclxuVXNlci5wcm90b3R5cGUuYXRMZWFzdCA9IGZ1bmN0aW9uKGF0TGVhc3QpIHtcclxuICAgIGxldCByb2xlID0gdGhpcy5yb2xlKCk7XHJcbiAgICBsZXQgcm9sZXMgPSB0aGlzLmdldFJvbGVzKCk7XHJcbiAgICBpZihyb2xlcy5oYXNPd25Qcm9wZXJ0eShhdExlYXN0KSkge1xyXG4gICAgICAgIHJldHVybiByb2xlc1tyb2xlXS5wcmlvcml0eSA+PSByb2xlc1thdExlYXN0XS5wcmlvcml0eTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuVXNlci5wcm90b3R5cGUuZ2V0Um9sZVByaW9yaXR5ID0gZnVuY3Rpb24ocm9sZSkge1xyXG4gICAgbGV0IHJvbGVzID0gdGhpcy5nZXRSb2xlcygpO1xyXG4gICAgaWYocm9sZXMuaGFzT3duUHJvcGVydHkocm9sZSkpIHtcclxuICAgICAgICByZXR1cm4gcm9sZXNbcm9sZV0ucHJpb3JpdHk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIDA7XHJcbn1cclxuXHJcblVzZXIucHJvdG90eXBlLmRpc3BsYXlOYW1lID0gZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29tbWEgPSB0aGlzLm5hbWUuaW5kZXhPZignLCcpO1xyXG4gICAgaWYoY29tbWEgPCAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgbGFzdCA9IHRoaXMubmFtZS5zdWJzdHIoMCwgY29tbWEpO1xyXG4gICAgbGV0IGZpcnN0ID0gdGhpcy5uYW1lLnN1YnN0cihjb21tYSsxKS50cmltKCk7XHJcblxyXG4gICAgcmV0dXJuIGZpcnN0ICsgJyAnICsgbGFzdDtcclxufVxyXG5cclxuXHJcblVzZXIucHJvdG90eXBlLnVzZXJSb2xlTmFtZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc3Qgcm9sZXMgPSB0aGlzLmdldFVzZXJSb2xlcygpO1xyXG4gICAgbGV0IHJvbGUgPSB0aGlzLnVzZXJSb2xlKCk7XHJcbiAgICBsZXQgciA9IHJvbGVzW3JvbGVdO1xyXG5cdGlmKHIgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0cmV0dXJuICdJbnZhbGlkJztcclxuXHR9XHJcblxyXG5cdGlmKHNob3J0ID09PSB0cnVlICYmIHIuc2hvcnQgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0cmV0dXJuIHIuc2hvcnQ7XHJcblx0fVxyXG5cclxuICAgIHJldHVybiByLm5hbWU7XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogUmV0dXJuIHRoZSByb2xlIG5hbWUgZm9yIHRoaXMgdXNlci5cclxuICogQHBhcmFtIHNob3J0IElmIHNldCB0byB0cnVlLCBhIHNob3J0IHZlcnNpb24gaXMgc3VwcGxpZWQgaWYgYXZhaWxhYmxlLlxyXG4gKiBAcmV0dXJucyBzdHJpbmdcclxuICovXHJcblVzZXIucHJvdG90eXBlLnJvbGVOYW1lID0gZnVuY3Rpb24oc2hvcnQpIHtcclxuICAgIGNvbnN0IHJvbGVzID0gdGhpcy5nZXRSb2xlcygpO1xyXG4gICAgbGV0IHJvbGUgPSB0aGlzLnJvbGUoKTtcclxuXHRsZXQgciA9IHJvbGVzW3JvbGVdO1xyXG5cdGlmKHIgPT09IHVuZGVmaW5lZCkge1xyXG5cdCAgICByZXR1cm4gJ0ludmFsaWQnO1xyXG4gICAgfVxyXG5cclxuXHRpZihzaG9ydCA9PT0gdHJ1ZSAmJiByLnNob3J0ICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdHJldHVybiByLnNob3J0O1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHIubmFtZTtcclxufVxyXG5cclxuVXNlci5jb21wYXJlID0gZnVuY3Rpb24oYSwgYikge1xyXG4gICAgbGV0IGFuID0gYS5uYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgICBsZXQgYm4gPSBiLm5hbWUudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICBpZihhbiA8IGJuKSB7XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGFuID4gYm4pIHtcclxuICAgICAgICByZXR1cm4gMTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYS5pZCAtIGIuaWQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJbnN0YW50aWF0ZSBhIE1lbWJlcnNoaXAgb2JqZWN0IGZvciB0aGUgdXNlci5cclxuICogVGhpcyB3aWxsIGJlIHJlcGxhY2VkIGJ5IGEgcGx1Z2luIHRoYXQgYWRkc1xyXG4gKiBzdXBwb3J0IGZvciBtZW1iZXJzaGlwcy5cclxuICogQHBhcmFtIGRhdGEgbm9ybWFsbHkgaW4gdGhlIGZvcm1hdCB0aGUgUEhQIEpTT04gcmVwcmVzZW50YXRpb25cclxuICogQHJldHVybnMge251bGx9XHJcbiAqL1xyXG5Vc2VyLmluc3RhbnRpYXRlTWVtYmVyID0gZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFVzZXI7XHJcbmV4cG9ydCB7VXNlcn07Il0sInNvdXJjZVJvb3QiOiIifQ==
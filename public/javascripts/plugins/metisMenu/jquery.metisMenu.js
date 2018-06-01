/*
<<<<<<< HEAD
 * metismenu - v2.0.2
 * A jQuery menu plugin
=======
 * metismenu - v1.1.3
 * Easy menu jQuery plugin for Twitter Bootstrap 3
>>>>>>> cec16021b2e7c761015eb4075ce8b97a4aa57c6c
 * https://github.com/onokumus/metisMenu
 *
 * Made by Osman Nuri Okumus
 * Under MIT License
 */
<<<<<<< HEAD

!function(a){"use strict";function b(){var a=document.createElement("mm"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]};return!1}function c(b){return this.each(function(){var c=a(this),d=c.data("mm"),f=a.extend({},e.DEFAULTS,c.data(),"object"==typeof b&&b);d||c.data("mm",d=new e(this,f)),"string"==typeof b&&d[b]()})}a.fn.emulateTransitionEnd=function(b){var c=!1,e=this;a(this).one("mmTransitionEnd",function(){c=!0});var f=function(){c||a(e).trigger(d.end)};return setTimeout(f,b),this};var d=b();d&&(a.event.special.mmTransitionEnd={bindType:d.end,delegateType:d.end,handle:function(b){return a(b.target).is(this)?b.handleObj.handler.apply(this,arguments):void 0}});var e=function(b,c){this.$element=a(b),this.options=a.extend({},e.DEFAULTS,c),this.transitioning=null,this.init()};e.TRANSITION_DURATION=350,e.DEFAULTS={toggle:!0,doubleTapToGo:!1,activeClass:"active"},e.prototype.init=function(){var b=this,c=this.options.activeClass;this.$element.find("li."+c).has("ul").children("ul").addClass("collapse in"),this.$element.find("li").not("."+c).has("ul").children("ul").addClass("collapse"),this.options.doubleTapToGo&&this.$element.find("li."+c).has("ul").children("a").addClass("doubleTapToGo"),this.$element.find("li").has("ul").children("a").on("click.metisMenu",function(d){var e=a(this),f=e.parent("li"),g=f.children("ul");return d.preventDefault(),f.hasClass(c)?b.hide(g):b.show(g),b.options.doubleTapToGo&&b.doubleTapToGo(e)&&"#"!==e.attr("href")&&""!==e.attr("href")?(d.stopPropagation(),void(document.location=e.attr("href"))):void 0})},e.prototype.doubleTapToGo=function(a){var b=this.$element;return a.hasClass("doubleTapToGo")?(a.removeClass("doubleTapToGo"),!0):a.parent().children("ul").length?(b.find(".doubleTapToGo").removeClass("doubleTapToGo"),a.addClass("doubleTapToGo"),!1):void 0},e.prototype.show=function(b){var c=this.options.activeClass,f=a(b),g=f.parent("li");if(!this.transitioning&&!f.hasClass("in")){g.addClass(c),this.options.toggle&&this.hide(g.siblings().children("ul.in")),f.removeClass("collapse").addClass("collapsing").height(0),this.transitioning=1;var h=function(){f.removeClass("collapsing").addClass("collapse in").height(""),this.transitioning=0};return d?void f.one("mmTransitionEnd",a.proxy(h,this)).emulateTransitionEnd(e.TRANSITION_DURATION).height(f[0].scrollHeight):h.call(this)}},e.prototype.hide=function(b){var c=this.options.activeClass,f=a(b);if(!this.transitioning&&f.hasClass("in")){f.parent("li").removeClass(c),f.height(f.height())[0].offsetHeight,f.addClass("collapsing").removeClass("collapse").removeClass("in"),this.transitioning=1;var g=function(){this.transitioning=0,f.removeClass("collapsing").addClass("collapse")};return d?void f.height(0).one("mmTransitionEnd",a.proxy(g,this)).emulateTransitionEnd(e.TRANSITION_DURATION):g.call(this)}};var f=a.fn.metisMenu;a.fn.metisMenu=c,a.fn.metisMenu.Constructor=e,a.fn.metisMenu.noConflict=function(){return a.fn.metisMenu=f,this}}(jQuery);
=======
;(function($, window, document, undefined) {

    var pluginName = "metisMenu",
        defaults = {
            toggle: true,
            doubleTapToGo: false
        };

    function Plugin(element, options) {
        this.element = $(element);
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function() {

            var $this = this.element,
                $toggle = this.settings.toggle,
                obj = this;

            if (this.isIE() <= 9) {
                $this.find("li.active").has("ul").children("ul").collapse("show");
                $this.find("li").not(".active").has("ul").children("ul").collapse("hide");
            } else {
                $this.find("li.active").has("ul").children("ul").addClass("collapse in");
                $this.find("li").not(".active").has("ul").children("ul").addClass("collapse");
            }

            //add the "doubleTapToGo" class to active items if needed
            if (obj.settings.doubleTapToGo) {
                $this.find("li.active").has("ul").children("a").addClass("doubleTapToGo");
            }

            $this.find("li").has("ul").children("a").on("click" + "." + pluginName, function(e) {
                e.preventDefault();

                //Do we need to enable the double tap
                if (obj.settings.doubleTapToGo) {

                    //if we hit a second time on the link and the href is valid, navigate to that url
                    if (obj.doubleTapToGo($(this)) && $(this).attr("href") !== "#" && $(this).attr("href") !== "") {
                        e.stopPropagation();
                        document.location = $(this).attr("href");
                        return;
                    }
                }

                $(this).parent("li").toggleClass("active").children("ul").collapse("toggle");

                if ($toggle) {
                    $(this).parent("li").siblings().removeClass("active").children("ul.in").collapse("hide");
                }

            });
        },

        isIE: function() { //https://gist.github.com/padolsey/527683
            var undef,
                v = 3,
                div = document.createElement("div"),
                all = div.getElementsByTagName("i");

            while (
                div.innerHTML = "<!--[if gt IE " + (++v) + "]><i></i><![endif]-->",
                    all[0]
                ) {
                return v > 4 ? v : undef;
            }
        },

        //Enable the link on the second click.
        doubleTapToGo: function(elem) {
            var $this = this.element;

            //if the class "doubleTapToGo" exists, remove it and return
            if (elem.hasClass("doubleTapToGo")) {
                elem.removeClass("doubleTapToGo");
                return true;
            }

            //does not exists, add a new class and return false
            if (elem.parent().children("ul").length) {
                //first remove all other class
                $this.find(".doubleTapToGo").removeClass("doubleTapToGo");
                //add the class on the current element
                elem.addClass("doubleTapToGo");
                return false;
            }
        },

        remove: function() {
            this.element.off("." + pluginName);
            this.element.removeData(pluginName);
        }

    };

    $.fn[pluginName] = function(options) {
        this.each(function () {
            var el = $(this);
            if (el.data(pluginName)) {
                el.data(pluginName).remove();
            }
            el.data(pluginName, new Plugin(this, options));
        });
        return this;
    };

})(jQuery, window, document);
>>>>>>> cec16021b2e7c761015eb4075ce8b97a4aa57c6c

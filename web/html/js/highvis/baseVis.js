// Generated by CoffeeScript 1.3.3

/*
 * Copyright (c) 2011, iSENSE Project. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer. Redistributions in binary
 * form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials
 * provided with the distribution. Neither the name of the University of
 * Massachusetts Lowell nor the names of its contributors may be used to
 * endorse or promote products derived from this software without specific
 * prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
 * DAMAGE.
 *
*/


(function() {
  var keys, vals, _ref, _ref1, _ref2, _ref3,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  if ((_ref = window.globals) == null) {
    window.globals = {};
  }

  if ((_ref1 = globals.groupSelection) == null) {
    globals.groupSelection = (function() {
      var _i, _len, _ref2, _results;
      _ref2 = data.groups;
      _results = [];
      for (keys = _i = 0, _len = _ref2.length; _i < _len; keys = ++_i) {
        vals = _ref2[keys];
        _results.push(Number(keys));
      }
      return _results;
    })();
  }

  if ((_ref2 = globals.fieldSelection) == null) {
    globals.fieldSelection = data.normalFields.slice(0, 1);
  }

  if ((_ref3 = globals.xAxis) == null) {
    globals.xAxis = data.numericFields[0];
  }

  window.BaseVis = (function() {
    /*
        Constructor
            Assigns target canvas name
    */

    function BaseVis(canvas) {
      this.canvas = canvas;
    }

    /*
        Builds Highcharts options object
            Builds up the options common to all vis types.
            Subsequent derrived classes should use $.extend to expand upon these agter calling super()
    */


    BaseVis.prototype.buildOptions = function() {
      var _this = this;
      this.chartOptions = {
        chart: {
          renderTo: this.canvas,
          animation: false
        },
        credits: {
          enabled: false
        },
        legend: {
          symbolWidth: 60,
          itemWidth: 200
        },
        plotOptions: {
          series: {
            marker: {
              lineWidth: 1,
              radius: 5
            },
            events: {
              legendItemClick: function(event) {
                var index;
                index = data.normalFields[event.target.index];
                if (event.target.visible) {
                  arrayRemove(globals.fieldSelection, index);
                } else {
                  globals.fieldSelection.push(index);
                }
                return _this.update();
              }
            }
          }
        },
        series: [],
        title: {}
      };
      this.chartOptions.xAxis = [];
      this.chartOptions.xAxis.push({});
      this.chartOptions.xAxis.push({
        lineWidth: 0,
        categories: ['']
      });
      return this.chartOptions.series = this.buildLegendSeries();
    };

    /*
        Builds the 'fake series' for legend controls.
            Derrived objects should implement this.
    */


    BaseVis.prototype.buildLegendSeries = function() {
      console.log(console.trace());
      return alert("BAD IMPLEMENTATION ALERT!\n\nCalled: 'BaseVis.buildLegendSeries'\n\nSee logged stack trace in console.");
    };

    /*
        Start sequence used by runtime
            This is called when the user switched to this vis.
            Should re-build options and the chart itself to ensure sync with global settings.
            This method should also be usable as a 'full update' in that it should destroy the current chart if it exists before generating a fresh one.
    */


    BaseVis.prototype.start = function() {
      var index, ser, _i, _len, _ref4;
      this.buildOptions();
      if (this.chart != null) {
        this.chart.destroy();
      }
      this.chart = new Highcharts.Chart(this.chartOptions);
      _ref4 = this.chart.series.slice(0, data.normalFields.length);
      for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
        ser = _ref4[_i];
        index = data.normalFields[ser.index];
        if (__indexOf.call(globals.fieldSelection, index) >= 0) {
          ser.show();
        } else {
          ser.hide();
        }
      }
      ($('#' + this.canvas)).show();
      return this.update();
    };

    /*
        End sequence used by runtime
            This is called when the user switches away from this vis.
            Should destroy the chart, hide its canvas and remove controls.
    */


    BaseVis.prototype.end = function() {
      this.chart.destroy();
      this.clearControls();
      return ($('#' + this.canvas)).hide();
    };

    /*
        Update minor state
            Should update the hidden status based on both high-charts legend action and control checkboxes.
    */


    BaseVis.prototype.update = function() {
      this.clearControls();
      return this.drawControls();
    };

    /*
        Clear the controls
            Unbinds control handlers and clears the HTML elements.
    */


    BaseVis.prototype.clearControls = function() {
      return ($('#controldiv')).html('');
    };

    /*
        Draws controls
            Derived classes should write control HTML and bind handlers using the methods defined below.
    */


    BaseVis.prototype.drawControls = function() {
      console.log(console.trace());
      return alert("BAD IMPLEMENTATION ALERT!\n\nCalled: 'BaseVis.drawControls'\n\nSee logged stack trace in console.");
    };

    /*
        Draws group selection controls
            This includes a series of checkboxes and a selector for the grouping field.
            The checkbox text color should correspond to the graph color.
    */


    BaseVis.prototype.drawGroupControls = function() {
      var controls, counter, fieldIndex, gIndex, group, _i, _j, _len, _len1, _ref4, _ref5, _ref6,
        _this = this;
      controls = '<div id="groupControl" class="vis_controls">';
      controls += '<table class="vis_control_table"><tr><td class="vis_control_table_title">Groups:</tr></td>';
      controls += '<tr><td><div class="vis_control_table_div">';
      controls += '<select class="group_selector">';
      _ref4 = data.textFields;
      for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
        fieldIndex = _ref4[_i];
        controls += "<option value=\"" + (Number(fieldIndex)) + "\">" + data.fields[fieldIndex].fieldName + "</option>";
      }
      controls += "</select></div></td></tr>";
      counter = 0;
      _ref5 = data.groups;
      for (gIndex = _j = 0, _len1 = _ref5.length; _j < _len1; gIndex = ++_j) {
        group = _ref5[gIndex];
        controls += '<tr><td>';
        controls += "<div class=\"vis_control_table_div\" style=\"color:" + globals.colors[counter] + ";\">";
        controls += "<input class='group_input' type='checkbox' value='" + gIndex + "' " + ((_ref6 = Number(gIndex), __indexOf.call(globals.groupSelection, _ref6) >= 0) ? "checked" : "") + "/>&nbsp";
        controls += "" + group + "&nbsp";
        controls += "</div></td></tr>";
        counter += 1;
      }
      controls += '</table></div>';
      ($('#controldiv')).append(controls);
      ($('.group_selector')).change(function(e) {
        var element, _ref7;
        element = e.target || e.srcElement;
        data.setGroupIndex(Number(element.value));
        if ((_ref7 = globals.groupSelection) == null) {
          globals.groupSelection = (function() {
            var _k, _len2, _ref8, _results;
            _ref8 = data.groups;
            _results = [];
            for (keys = _k = 0, _len2 = _ref8.length; _k < _len2; keys = ++_k) {
              vals = _ref8[keys];
              _results.push(Number(keys));
            }
            return _results;
          })();
        }
        return _this.start();
      });
      return ($('.group_input')).click(function(e) {
        var selection;
        selection = [];
        ($('.group_input')).each(function() {
          if (this.checked) {
            console.log('checked');
            return selection.push(Number(this.value));
          } else {
            return console.log('unchecked');
          }
        });
        globals.groupSelection = selection;
        return _this.update();
      });
    };

    /*
        Draws x axis selection controls
            This includes a series of radio buttons.
    */


    BaseVis.prototype.drawXAxisControls = function() {
      var controls, field, fieldIndex, _i, _len, _ref4,
        _this = this;
      controls = '<div id="xAxisControl" class="vis_controls">';
      controls += '<table class="vis_control_table"><tr><td class="vis_control_table_title">X Axis:</tr></td>';
      _ref4 = data.fields;
      for (fieldIndex = _i = 0, _len = _ref4.length; _i < _len; fieldIndex = ++_i) {
        field = _ref4[fieldIndex];
        if ((Number(data.fields[fieldIndex].typeID)) !== 37) {
          controls += '<tr><td>';
          controls += '<div class="vis_control_table_div">';
          controls += "<input class=\"xAxis_input\" type=\"radio\" name=\"xaxis\" value=\"" + fieldIndex + "\" " + ((Number(fieldIndex)) === globals.xAxis ? "checked" : "") + "></input>&nbsp";
          controls += "" + data.fields[fieldIndex].fieldName + "&nbsp";
          controls += "</div></td></tr>";
        }
      }
      controls += '</table></div>';
      ($('#controldiv')).append(controls);
      return ($('.xAxis_input')).click(function(e) {
        var selection;
        selection = null;
        ($('.xAxis_input')).each(function() {
          if (this.checked) {
            return selection = this.value;
          }
        });
        globals.xAxis = Number(selection);
        return _this.start();
      });
    };

    return BaseVis;

  })();

}).call(this);

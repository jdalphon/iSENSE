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
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.Histogram = (function(_super) {

    __extends(Histogram, _super);

    function Histogram(canvas) {
      this.canvas = canvas;
      this.MAX_NUM_BINS = 1000;
      this.displayField = data.normalFields[0];
      this.binNumSug = 1;
    }

    Histogram.prototype.start = function() {
      var _ref;
      if ((_ref = this.binSize) == null) {
        this.binSize = this.defaultBinSize();
      }
      return Histogram.__super__.start.call(this);
    };

    Histogram.prototype.buildOptions = function() {
      var self,
        _this = this;
      Histogram.__super__.buildOptions.call(this);
      self = this;
      this.chartOptions;
      return $.extend(true, this.chartOptions, {
        chart: {
          type: "column"
        },
        legend: {
          symbolWidth: 0
        },
        title: {
          text: ""
        },
        tooltip: {
          formatter: function() {
            var str;
            str = "<table>";
            str += "<tr><td>Bin Location:</td><td>" + this.x + "<td></tr>";
            str += "<tr><td>Bin Total:</td><td>" + this.total + "<td></tr>";
            if (this.y !== 0) {
              str += "<tr><td><div style='color:" + this.series.color + ";'> " + this.series.name + ":</div></td>";
              str += "<td>" + this.y + "</td></tr>";
            }
            return str += "</table>";
          },
          useHTML: true
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            groupPadding: 0,
            pointPadding: 0
          },
          series: {
            events: {
              legendItemClick: (function() {
                return function(event) {
                  self.displayField = this.options.legendIndex;
                  self.binSize = self.defaultBinSize();
                  ($("#binSizeInput")).attr('value', self.binSize);
                  return self.delayedUpdate();
                };
              })()
            }
          }
        }
      });
    };

    /*
        Returns a rough default 'human-like' bin size selection
    */


    Histogram.prototype.defaultBinSize = function() {
      var bestNum, bestSize, binNumTarget, curSize, groupIndex, localMax, localMin, max, min, range, tryNewSize, _i, _len, _ref,
        _this = this;
      min = Number.MAX_VALUE;
      max = Number.MIN_VALUE;
      _ref = globals.groupSelection;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        groupIndex = _ref[_i];
        localMin = data.getMin(this.displayField, groupIndex);
        if (localMin !== null) {
          min = Math.min(min, localMin);
        }
        localMax = data.getMax(this.displayField, groupIndex);
        if (localMax !== null) {
          max = Math.max(max, localMax);
        }
      }
      range = max - min;
      if (max < min) {
        return 1;
      }
      curSize = 1;
      bestSize = curSize;
      bestNum = range / curSize;
      binNumTarget = Math.pow(10, this.binNumSug);
      tryNewSize = function(size) {
        if ((Math.abs(binNumTarget - (range / size))) < (Math.abs(binNumTarget - bestNum))) {
          bestSize = size;
          bestNum = range / size;
          return true;
        }
        return false;
      };
      while (true) {
        if ((range / curSize) < binNumTarget) {
          curSize /= 10;
        } else if ((range / curSize) > binNumTarget) {
          curSize *= 10;
        }
        if (!tryNewSize(curSize)) {
          break;
        }
      }
      tryNewSize(curSize / 2);
      tryNewSize(curSize * 2);
      tryNewSize(curSize / 5);
      tryNewSize(curSize * 5);
      return bestSize;
    };

    Histogram.prototype.update = function() {
      var bin, binArr, binObjs, dc, fakeDat, finalData, groupData, groupIndex, i, max, min, number, occurences, options, ret, selecteddata, sum, _base, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3;
      Histogram.__super__.update.call(this);
      this.chart.yAxis[0].setTitle({
        text: "Quantity"
      }, false);
      this.chart.xAxis[0].setTitle({
        text: data.fields[this.displayField].fieldName
      }, false);
      if (globals.groupSelection.length === 0) {
        return;
      }
      while (this.chart.series.length > data.normalFields.length) {
        this.chart.series[this.chart.series.length - 1].remove(false);
      }
      /* ---
      */

      this.globalmin = Number.MAX_VALUE;
      this.globalmax = Number.MIN_VALUE;
      _ref = globals.groupSelection;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        groupIndex = _ref[_i];
        min = data.getMin(this.displayField, groupIndex);
        min = Math.round(min / this.binSize) * this.binSize;
        this.globalmin = Math.min(this.globalmin, min);
        max = data.getMax(this.displayField, groupIndex);
        max = Math.round(max / this.binSize) * this.binSize;
        this.globalmax = Math.max(this.globalmax, max);
      }
      fakeDat = (function() {
        var _j, _ref1, _ref2, _ref3, _results;
        _results = [];
        for (i = _j = _ref1 = this.globalmin, _ref2 = this.globalmax, _ref3 = this.binSize; _ref1 <= _ref2 ? _j < _ref2 : _j > _ref2; i = _j += _ref3) {
          _results.push([i, 0]);
        }
        return _results;
      }).call(this);
      options = {
        showInLegend: false,
        data: fakeDat
      };
      this.chart.addSeries(options, false);
      /*
      */

      binObjs = {};
      _ref1 = globals.groupSelection;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        groupIndex = _ref1[_j];
        selecteddata = data.selector(this.displayField, groupIndex);
        binArr = (function() {
          var _k, _len2, _results;
          _results = [];
          for (_k = 0, _len2 = selecteddata.length; _k < _len2; _k++) {
            i = selecteddata[_k];
            _results.push(Math.round(i / this.binSize) * this.binSize);
          }
          return _results;
        }).call(this);
        binObjs[groupIndex] = {};
        for (_k = 0, _len2 = binArr.length; _k < _len2; _k++) {
          bin = binArr[_k];
          if ((_ref2 = (_base = binObjs[groupIndex])[bin]) == null) {
            _base[bin] = 0;
          }
          binObjs[groupIndex][bin]++;
        }
      }
      _ref3 = globals.groupSelection;
      for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
        groupIndex = _ref3[_l];
        finalData = (function() {
          var _ref4, _results;
          _ref4 = binObjs[groupIndex];
          _results = [];
          for (number in _ref4) {
            occurences = _ref4[number];
            sum = 0;
            for (dc in binObjs) {
              groupData = binObjs[dc];
              if (groupData[number]) {
                sum += groupData[number];
              }
            }
            _results.push(ret = {
              x: Number(number),
              y: occurences,
              total: sum
            });
          }
          return _results;
        })();
        /* ---
        */

        options = {
          showInLegend: false,
          color: globals.colors[groupIndex % globals.colors.length],
          name: data.groups[groupIndex],
          data: finalData
        };
        this.chart.addSeries(options, false);
      }
      this.chart.xAxis[0].setExtremes(this.globalmin - (this.binSize / 2), this.globalmax + (this.binSize / 2), false);
      return this.chart.redraw();
    };

    Histogram.prototype.buildLegendSeries = function() {
      var count, dummy, field, fieldIndex, _i, _len, _ref, _results;
      count = -1;
      _ref = data.fields;
      _results = [];
      for (fieldIndex = _i = 0, _len = _ref.length; _i < _len; fieldIndex = ++_i) {
        field = _ref[fieldIndex];
        if (!(__indexOf.call(data.normalFields, fieldIndex) >= 0)) {
          continue;
        }
        count += 1;
        _results.push(dummy = {
          data: [],
          color: '#000',
          visible: this.displayField === fieldIndex,
          name: field.fieldName,
          type: 'area',
          xAxis: 1,
          legendIndex: fieldIndex
        });
      }
      return _results;
    };

    Histogram.prototype.drawToolControls = function() {
      var controls, _ref,
        _this = this;
      controls = "";
      controls += '<div id="toolControl" class="vis_controls">';
      controls += "<h3 class='clean_shrink'><a href='#'>Tools:</a></h3>";
      controls += "<div class='outer_control_div'>";
      controls += "<h4 class='clean_shrink'>Bin Size</h4>";
      controls += "Automatic : <br>";
      controls += "<div id='binSizeSlider' style='width:90%;margin-left:5%'></div><br>";
      controls += "Manual: <input id='binSizeInput' class='control_select' value='" + this.binSize + "'></input>";
      controls += '</div></div></div>';
      ($('#controldiv')).append(controls);
      ($('#binSizeSlider')).slider({
        range: 'min',
        value: this.binNumSug,
        min: .5,
        max: 2.2,
        step: .1,
        slide: function(event, ui) {
          var newBinSize;
          _this.binNumSug = Number(ui.value);
          newBinSize = _this.defaultBinSize();
          if (!fpEq(newBinSize, _this.binSize)) {
            _this.binSize = newBinSize;
            ($('#binSizeInput')).attr("value", "" + _this.binSize);
            return _this.delayedUpdate();
          }
        }
      });
      if ((_ref = globals.toolsOpen) == null) {
        globals.toolsOpen = 0;
      }
      ($('#toolControl')).accordion({
        collapsible: true,
        active: globals.toolsOpen
      });
      ($('#toolControl > h3')).click(function() {
        return globals.toolsOpen = (globals.toolsOpen + 1) % 2;
      });
      return ($("#binSizeInput")).keydown(function() {
        var newBinSize;
        if (event.keyCode === 13) {
          newBinSize = Number(($('#binSizeInput')).val());
          if (isNaN(newBinSize)) {
            alert("Please enter a valid number.");
            return;
          }
          if (newBinSize <= 0) {
            alert("Please enter a positive bin size.");
            return;
          }
          if (((_this.globalmax - _this.globalmin) / newBinSize) < _this.MAX_NUM_BINS) {
            _this.binSize = newBinSize;
            return _this.update();
          } else {
            return alert("Entered bin size would result in too many bins.");
          }
        }
      });
    };

    Histogram.prototype.drawControls = function() {
      Histogram.__super__.drawControls.call(this);
      this.drawGroupControls();
      this.drawToolControls();
      return this.drawSaveControls();
    };

    return Histogram;

  })(BaseHighVis);

  if (__indexOf.call(data.relVis, "Histogram") >= 0) {
    globals.histogram = new Histogram('histogram_canvas');
  } else {
    globals.histogram = new DisabledVis('histogram_canvas');
  }

}).call(this);

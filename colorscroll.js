var colorScroll = {};

colorScroll.ColorPoint = function(position, color) {
    var that = this;

    // number of pixels or top-offset ratio
    this.position = function() {
        return position; 
    };

    this.color = color instanceof $.Color ? color : new $.Color(color);
    this.red = this.color.red();
    this.green = this.color.green();
    this.blue = this.color.blue();

    this.mix = function(other, ratio) {
        var newRed = that.red + ( ( other.red - that.red ) * ratio );
        var newGreen = that.green + ( ( other.green - that.green ) * ratio );
        var newBlue = that.blue + ( ( other.blue - that.blue ) * ratio );
        return new $.Color( newRed, newGreen, newBlue );
    };
};

colorScroll.Plot = function(elementSelector, property, rawColorPoints, scrollElementSelector) {
    var that = this;
    this.$el = $(elementSelector);
    this.$scrollEl = scrollElementSelector ? $(scrollElementSelector) : this.$el;
    
    this.lastPosition = $(document).scrollTop();
    this.positionChange = function(count) {
        var scrollTop = $(document).scrollTop();
        var result = scrollTop - that.lastPosition;
        that.lastPosition = scrollTop;
        return result;
    };

    // plot colors from start to end
    this.colorPoints = [];
    this.add = function(position, color) {
        that.colorPoints.push(new colorScroll.ColorPoint(position, color));
    };
    rawColorPoints = rawColorPoints.sort(function(a, b) {
        return a.position - b.position;
    });
    var l = rawColorPoints.length;
    var relativePositioning = rawColorPoints[l-1].position <= 1;
    var height = this.$scrollEl.height(); // CHANGE
    if (rawColorPoints[0].position > 0) this.add(0, rawColorPoints[0].color);
    for (var i=0; i<l; i++) {
        var newPosition = rawColorPoints[i].position * (relativePositioning ? height : 1);
        this.add(newPosition, rawColorPoints[i].color);
    }
    if (rawColorPoints[l-1].position < height) this.add(height, rawColorPoints[l-1].color);
    this.length = this.colorPoints.length;

    this.get = function(index) {
        return this.colorPoints[index];
    };

    this.colorPointsAt = function(scrollTop) {
        if (scrollTop < 0) {
            return that.get(0);
        } else if ( scrollTop > that.$scrollEl.height() ) {
            return that.get(that.length-1);
        }
        for (var i=0, l=that.length-1; i<l; i++) {
            if ( (that.get(i).position() <= scrollTop) && (that.get(i+1).position() > scrollTop) ) {
                return { start: that.get(i),
                         end: that.get(i+1) };
            }
        } 
    };

    this.active = false;

    this.change = function() {
        var newColor;
        var action = function() {};

        var scrollTop = $(document).scrollTop() - that.$scrollEl.offset().top;
        var current = that.colorPointsAt(scrollTop);
        if (current instanceof colorScroll.ColorPoint) {
            newColor = current.color;
        } else {
            if (that.active) return;
            var portionScrolled = (scrollTop - current.start.position()) / ( current.end.position() - current.start.position() );
            newColor = current.start.mix(current.end, portionScrolled);
            that.active = true;
            action = function(){
                if (that.positionChange() !== 0) that.change();
            };
        }

        var css = {};
        css[property] = newColor;
        that.$el.animate(css, 0, function() {
            that.active = false;
            action();
        });
            
    };
};



   



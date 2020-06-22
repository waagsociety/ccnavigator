const CurvedPolyline = {
    /**
     * make a smooth corner using a corner radius, use the output for svg arc to (A)
     * input: [p1,p2,p3], radius
     * output: [p1,p12,p2,p23,p3,pm]
     *
     *
     *                                     p3
     *                                    /
     *                                   /
     *                /---------\       /
     *               /           \     /
     *              /             \   /
     *             |               | /
     *             |       pm______|p23
     *              \      |a\     /
     *               \     |   \  /
     * p1_____________\____p12___\p2
     *
     * Circle touches lays in the armpit of the lines. It touches the lines at p12 and p23 orthogonally at distance radius (r) from the circle center.
     * First find the angle of the vector p2-pm, then determine the length of that vector using known angle a and the known length (r)
     * of the vector from p12-pm. Determine length l from p2 to p12 using pythagoras
     */
    smoothCorner: function (points, radius) {
        var p1 = points[0],
            p2 = points[1],
            p3 = points[2],
            v1 = [p1[0] - p2[0], p1[1] - p2[1]],
            v2 = [p3[0] - p2[0], p3[1] - p2[1]],
            a1 = Math.atan2(v1[1], v1[0]),
            a2 = Math.atan2(v2[1], v2[0]),
            am = (a1 + a2) * 0.5;

        if (Math.abs(a2 - a1) > Math.PI) { //if pm is in not in the armpit
            am += Math.PI;
        }

        var sc = Math.abs(radius / Math.sin(Math.abs(am - a1))), //length of hypotenus p2-pm
            pm = [p2[0] + Math.cos(am) * sc, p2[1] + Math.sin(am) * sc], //center for the circle in the armpit that touches both lines
            l = Math.sqrt(sc * sc - radius * radius), //distance of p12 to p2, pythagoras b^2 = c^2 - a^2
						p12 = [p2[0] + Math.cos(a1) * l, p2[1] + Math.sin(a1) * l], //between p1 and p2 where the circle touches the line orthogonally
            p23 = [p2[0] + Math.cos(a2) * l, p2[1] + Math.sin(a2) * l], //between p2 and p3 where the circle touches the line orthogonally
            dir = (a1 - a2),
            flag = false; //left turn

				//determin left or right turn
        if (dir < 0) {
            dir += (Math.PI * 2);
        }
        if (dir < Math.PI) {
            flag = true;
        }

        return [p1, p12, p23, p3, pm, flag];
    },

    /**
     * make SVG arc to path string
     * input: radius(of rounded corner), end point, sweep flag (true for right turn)
     * output : sring like "A 20 20 0 0 0 320 40"
     */
    arcTo: function (radius, point, sweepFlag) {
        return ("A" + [radius, radius].join(" ") + " 0 0 " + (sweepFlag ? "1" : "0") + " " + point.join(" "));
    },

    /**
     * make SVG move to path string
     * input: point
     * output : string like "M 10 20"
     */
    moveTo: function (point) {
        return "M " + point.join(" ");
    },

    /**
     * make SVG line to path string
     * input: point
     * output : string like "L 10 20"
     */
    lineTo: function (point) {
        return "L " + point.join(",");
    },

    /**
     * make a smooth polyline using arc to
     * input: [p1,p2,p3, ... , pn]
     * output: SVG path string
     */
    smoothPolyline: function (points, radius) {
        var comps = [];
        if (points.length >= 3) {
            for (var i = 0; i < points.length - 2; i += 1) {
                var arcPoints = CurvedPolyline.smoothCorner([points[i], points[i + 1], points[i + 2]], radius);
                if (i === 0) {
                    comps.push(CurvedPolyline.moveTo(arcPoints[0]));
                }
                comps.push(CurvedPolyline.lineTo(arcPoints[1]));
                comps.push(CurvedPolyline.arcTo(radius, arcPoints[2], arcPoints[5]));
                if (i === points.length - 3) {
                    comps.push(CurvedPolyline.lineTo(arcPoints[3]));
                }
            }
        } else if (points.length === 2) {
            comps.push(CurvedPolyline.moveTo(points[0]));
            comps.push(CurvedPolyline.lineTo(points[1]));
        }
        var pathString = comps.join("");
        return pathString;
    },

	  /**
     * get the armpit circles for smooth polyline
     * input: [p1,p2,p3, ... , pn]
     * output: [p1,p2 ... pn-2] (armpit points)
     */
    armpits: function (points, radius) {
        var armpits = [];
        if (points.length >= 3) {
            for (var i = 0; i < points.length - 2; i += 1) {
				var arcPoints = CurvedPolyline.smoothCorner([points[i], points[i + 1], points[i + 2]], radius);
				armpits.push(arcPoints[4]);
            }
        }
        return armpits;
	  },
    /**
     * add points to close the path between the first and the second point
     *
     */
    closeLine: function(points) {
      var closedPoints = points.slice(0);
      if (points.length >= 3) {
        var beginEnd = [(points[0][0] + points[1][0]) * 0.5, (points[0][1] + points[1][1]) * 0.5];
        closedPoints[0] = beginEnd;
        closedPoints.push(points[0]);
        closedPoints.push(beginEnd);
      }
      return closedPoints;
    }
};

export default CurvedPolyline;

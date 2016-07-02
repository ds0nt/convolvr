#ifdef GL_ES
		precision highp float;
		#endif

		uniform sampler2D tOne;
		uniform float time;
		uniform vec2 size;
        uniform float distortion;
        uniform float edgeDetect;
        uniform float scramble;
        uniform float tile;
        uniform float phase;
		varying vec2 vUv;

		void main (void) {
            vec4 color = vec4(0.0,0.0,0.0,0.0);
            vec2 surface = vec2(vUv.x, vUv.y);
       		float pixelX = 1.0/size.x;
			float pixelY = 1.0/size.y;
            if (distortion > 0.0) {
                surface = vec2(vUv.x+distortion*0.04*sin(vUv.y *32.0 * (1.0+0.2*sin(time))*(pixelX/pixelY)),vUv.y + distortion * 0.04*cos(vUv.x*32.0));
            }
            if (scramble > 0.0) {
				surface.x = floor(surface.x*scramble)/scramble;
				surface.y = floor(surface.y*scramble)/scramble;
			}
			if (tile > 0.0) {
				surface.x = fract(surface.x * sqrt(tile));
				surface.y = fract(surface.y * sqrt(tile));
			}
            if (edgeDetect > 0.0) {
			    vec4 edgeData[8];
			    edgeData[0] = texture2D(tOne, vec2(surface.x-pixelX,surface.y-pixelY));
			    edgeData[1] = 	texture2D(tOne, vec2(surface.x-pixelX,surface.y));
			    edgeData[2] = 	texture2D(tOne, vec2(surface.x-pixelX,surface.y+pixelY));
			    edgeData[3] = 	texture2D(tOne, vec2(surface.x,surface.y+pixelY));
			    edgeData[4] = 	texture2D(tOne, vec2(surface.x+pixelX,surface.y+pixelY));
			    edgeData[5] = 	texture2D(tOne, vec2(surface.x+pixelX,surface.y));
			    edgeData[6] =  	texture2D(tOne, vec2(surface.x+pixelX,surface.y-pixelY));
			    edgeData[7] = 	texture2D(tOne, vec2(surface.x,surface.y-pixelY));

			    color += 0.18 * abs(edgeData[4] - edgeData[0]);
			    color += 0.18 * abs(edgeData[5] - edgeData[1]);
			    color += 0.18 * abs(edgeData[6] - edgeData[2]);
			    color += 0.18 * abs(edgeData[7] - edgeData[3]);
				color += 0.18 * abs(edgeData[0] - edgeData[4]);
			    color += 0.18 * abs(edgeData[1] - edgeData[5]);
			    color += 0.18 * abs(edgeData[2] - edgeData[6]);
			    color += 0.18 * abs(edgeData[3] - edgeData[7]);
              //sin(color)*2.0; /// texture2D(tOne, vec2(surface.x,surface.y));; //vec4(c, 1.0);
		    } else if (phase > 0.0) {
                vec4 edgeData[8];
                vec4 edge = vec4(0,0,0,1);
                pixelX *= 1.5;
                pixelY *= 1.5;
			    edgeData[0] = texture2D(tOne, vec2(surface.x-pixelX,surface.y-pixelY));
			    edgeData[1] = 	texture2D(tOne, vec2(surface.x-pixelX,surface.y));
			    edgeData[2] = 	texture2D(tOne, vec2(surface.x-pixelX,surface.y+pixelY));
			    edgeData[3] = 	texture2D(tOne, vec2(surface.x,surface.y+pixelY));
			    edgeData[4] = 	texture2D(tOne, vec2(surface.x+pixelX,surface.y+pixelY));
			    edgeData[5] = 	texture2D(tOne, vec2(surface.x+pixelX,surface.y));
			    edgeData[6] =  	texture2D(tOne, vec2(surface.x+pixelX,surface.y-pixelY));
			    edgeData[7] = 	texture2D(tOne, vec2(surface.x,surface.y-pixelY));

			    edge += 0.18 * abs(edgeData[0] - edgeData[4]);
			    edge += 0.18 * abs(edgeData[1] - edgeData[5]);
			    edge += 0.18 * abs(edgeData[2] - edgeData[6]);
			    edge += 0.18 * abs(edgeData[3] - edgeData[7]);
				edge += 0.18 * abs(edgeData[4] - edgeData[0]);
			    edge += 0.18 * abs(edgeData[5] - edgeData[1]);
			    edge += 0.18 * abs(edgeData[6] - edgeData[2]);
			    edge += 0.18 * abs(edgeData[7] - edgeData[3]);
             color = texture2D(tOne, vec2(surface.x,surface.y)) - 1.5 * texture2D(tOne, vec2(0.5+0.5*sin(surface.x*4.0*phase),
                                                                                       0.5+0.5*cos(surface.y*4.0*phase)))*edge ;
            } else {
			 color = texture2D(tOne, vec2(surface.x,surface.y));
		}
		gl_FragColor =  color;
	}

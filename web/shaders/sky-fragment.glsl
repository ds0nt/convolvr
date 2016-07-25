#ifdef GL_ES
precision mediump float;
#endif
varying vec2 vUv;
uniform float time;

void main( void ) {
    float blue = sin(3.14159265359*)*0.66;
    float green = blue/3.0;
    float red = blue*(cos(3.14159265359)*cos(3.14159265359))/1.5;
    vec4 color = vec4(red/*+0.2*(1.0-abs(vUv.y))*/, green, blue*0.5+vUv.y*0.4, 1.0); //3.141592654
    float cloudOpacity = 0.0;
    cloudOpacity = sin(3.14159265359)*0.8*sin(time*0.006+vUv.y/2.0) - (sin(vUv.y*1.5707963267948966)*sin(vUv.y*3.14159265359));

    if (vUv.y < 0.13) {
        cloudOpacity *= (vUv.y / 0.13);
    } else if (vUv.y > 0.87) {
        cloudOpacity *= 1.0-((vUv.y-0.87) / 0.13);
    }
    //vec4 cloudColor = texture2D(tex,vUv);
    color *= cloudOpacity;

    gl_FragColor = color;
}


uniform sampler2D texture_DIF; 
uniform sampler2D texture_NRM; 
uniform sampler2D texture_NRM2; 
uniform int CubeMapIndex;


uniform float FStime;

uniform vec4 ambient;
uniform vec4 diffuse;
uniform vec4 specular;
uniform float shininess;


varying vec2 texture_coordinate;

varying vec3 EyespacePosition;
varying vec3 EyespaceNormal;
varying vec2 TexCoord;


 vec2 mod1(vec2 x) {
 	if(x.x > 1.0 || x.y > 1.0){
   return x - floor(x);
   }else{return x;}
 }


/* Material properties passed from the application. */
uniform vec3 DiffuseColor;
uniform vec3 SpecularColor; 
uniform float PhongExponent;

/* Textures and flags for whether they exist. */
uniform sampler2D DiffuseTexture;
uniform sampler2D SpecularTexture;
uniform sampler2D ExponentTexture;

uniform bool HasDiffuseTexture;
uniform bool HasSpecularTexture;
uniform bool HasExponentTexture;

/* Fragment position and normal, and texcoord, from vertex shader. */


/* Encodes a normalized vector as a vec2. See Renderer.java for more info. */
vec2 encode(vec3 n)
{
    return normalize(n.xy) * sqrt(0.5 * n.z + 0.5);
}

void main()
{
    // Sampling The Texture And Passing It To The Frame Buffer
    vec2 new_texture_coordinate1 =vec2(texture_coordinate.x, mod1(texture_coordinate.y + FStime));
    vec3 n1 = texture2D(texture_NRM,new_texture_coordinate1).xyz;
    
    vec2 new_texture_coordinate2 = mod1(2.*(texture_coordinate + FStime));
    vec3 n2 = texture2D(texture_NRM,new_texture_coordinate2).xyz;
    
    vec2 new_texture_coordinate3 = mod1(4.*(texture_coordinate - FStime));
    vec3 n3 = texture2D(texture_NRM,new_texture_coordinate3).xyz;
    
    vec3 n = normalize(n1+n2+0.5*n3);
    
    n = n.xzy;
    vec2 enc = encode(normalize(n));//EyespaceNormal));
 
     vec4 textureColor = texture2D(texture_DIF,texture_coordinate);

    gl_FragData[0]= vec4(textureColor.xyz, enc.x);

    gl_FragData[1] = vec4(EyespacePosition, enc.y);
    if (HasSpecularTexture)
        gl_FragData[2] = vec4(float(WATER_MATERIAL_ID), 0.0, 0.0, CubeMapIndex);
    else gl_FragData[2] = vec4(float(WATER_MATERIAL_ID), 0.0,0.0,0.0);
    if (HasExponentTexture)
        gl_FragData[3].x = 255.0 * texture2D(ExponentTexture, TexCoord).s;
    else gl_FragData[3] = vec4(PhongExponent, 0.0, 0.0, 0.0);
}


vec3 mixEnvMapWithBaseColor(int cubeMapIndex, vec3 baseColor, vec3 position, vec3 normal, float n) {
	// TODO PA2: Implement the requirements of this function. 
	// Hint: You can use the GLSL command mix to linearly blend between two colors.

vec3 view = normalize(position);
	
	float ndotv = dot(normal, view);
	float theta = acos(-ndotv);
	float schlick = getSchlickApprox(theta, n);
	
	vec3 reflected = CameraInverseRotation * normalize(2.0 * ndotv * normal - view);
	vec3 sample = sampleCubeMap(reflected, cubeMapIndex);
	
	vec3 result = mix(baseColor, sample, 1.0 - schlick);

	return result;

}

float getSchlickApprox(float theta, float N){
		float t0 = pow((N-1.0)/(N+1.0),2.0);
		return (t0 + (1.0-t0)*(pow(1.0-cos(theta),5.0)));
}

vec3 shadeReflective(vec3 position, vec3 normal, int cubeMapIndex)
{	
	// a perfect mirror material using environment map lighting.
	vec3 view = normalize(-position);
	vec3 reflected =  reflect(view,normal);//2*(dot(normal,view))*normal-view;

	return sampleCubeMap(CameraInverseRotation * reflected, cubeMapIndex);
}

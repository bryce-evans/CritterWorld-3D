

uniform sampler2D texture_DIF; 
uniform sampler2D texture_NRM; 
uniform sampler2D texture_NRM2; 
uniform int CubeMapIndex;

uniform float FStime;
uniform float VStime;
varying float update_dist;
varying float offset;
varying float units_shifted;

uniform vec4 ambient;
uniform vec4 diffuse;
uniform vec4 specular;
uniform float shininess;

varying vec2 texture_coordinate;

attribute vec4 VertexTangent;

varying vec3 EyespacePosition;
varying vec3 EyespaceNormal;
varying vec3 EyespaceTangent;
varying vec3 EyespaceBiTangent;

varying vec2 TexCoord;

 vec2 mod1(vec2 x) {
   return x - floor(x);
 }

void main()
{
	
	EyespacePosition = vec3(gl_ModelViewMatrix * gl_Vertex);
	EyespaceNormal = gl_NormalMatrix * gl_Normal; //normalize(vec3(gl_ModelViewMatrix * vec4(gl_Normal,0)));
	
	EyespaceTangent = normalize(gl_NormalMatrix * VertexTangent.xyz);
	EyespaceBiTangent = normalize(cross(EyespaceNormal,EyespaceTangent));
	
	texture_coordinate = gl_MultiTexCoord0.st;
	vec4 newVertex = gl_Vertex;
	
	// rate of shift, different than ripple time
	
	update_dist = 4.0/65.0;
	offset = mod(VStime,update_dist);
	units_shifted = (VStime - offset);
	newVertex.x += offset;
	
	
	texture_coordinate = vec2(texture_coordinate.x,mod1(texture_coordinate.y - (1.0/2.0)*units_shifted));
	
	
	//texture_coordinate = gl_MultiTexCoord0.st;

	gl_Position = gl_ModelViewProjectionMatrix * newVertex;
	//gl_Position = ftransform();

}

			
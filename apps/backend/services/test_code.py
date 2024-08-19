class GeneratedScene(Scene):
    def construct(self):
        hello_world = Tex("Hello World!").scale(3)
        self.play(Write(hello_world))
        self.play(
            self.camera.animate.set_euler_angles(
                theta=-10*DEGREES,
                phi=50*DEGREES
            )
        )
        self.play(FadeOut(hello_world))
        surface = OpenGLSurface(
            lambda u, v: (u, v, u*np.sin(v) + v*np.cos(u)),
            u_range=(-3, 3),
            v_range=(-3, 3)
        )
        surface_mesh = OpenGLSurfaceMesh(surface)
        self.play(Create(surface_mesh))
        self.play(FadeTransform(surface_mesh, surface))
        self.wait()
        light = self.camera.light_source
        self.play(light.animate.shift([0, 0, -20]))
        self.play(light.animate.shift([0, 0, 10]))
        self.play(self.camera.animate.set_euler_angles(theta=60*DEGREES))
        
        # self.interactive_embed()

        # self.play(self.camera.animate.set_euler_angles(theta=0*DEGREES))
        # self.play(FadeOut(surface, shift=np.array([0, 0, -2])))

        # red_sphere = Sphere(color=RED)
        # self.play(Create(red_sphere))
        # self.play(red_sphere.animate.scale(3))

        # sphere_mesh = OpenGLSurfaceMesh(red_sphere)
        # play(Transform(red_sphere, sphere_mesh))  # graphics glitch :-)

        # self.play(self.camera.animate.set_euler_angles(phi=0, theta=0))
import re
import pprint

def has_unclosed_parenthesis(s):
    stack = []
    for char in s:
        if char == '(':
            stack.append(char)
        elif char == ')':
            if not stack:
                return True  # Closing parenthesis without opening
            stack.pop()
    return len(stack) > 0  # True if there are unclosed parentheses

def has_unclosed_bracket(s):
    stack = []
    for char in s:
        if char == '[':
            stack.append(char)
        elif char == ']':
            if not stack:
                return True  
            stack.pop()
    return len(stack) > 0 

def has_indented_statement(s):
    return ':\n' in s # or bool(re.search(r'^    ', s))

def extract_indented_statement(s):
    group = re.compile(r'(.*:\n(?:    .*\n)+)(^[^\s])', re.MULTILINE)
    split = group.split(s)
    return split

def replace_list_comprehensions(code):
    def replacement(match):
        print('REPLACING LIST COMPREHENSIONS')
        self_play = match.group(1)
        assignment = match.group(2)
        expression = match.group(3)
        var = match.group(4)
        iterable = match.group(5)
        additional_args = match.group(6)
        
        if assignment:
            var_name = assignment.split('=')[0].strip()
            return f"{var_name} = []\nfor {var} in {iterable.strip()}:\n    {var_name}.append({expression.strip()})"
        elif self_play:
            create_temp_var = f"result = []\nfor {var} in {iterable.strip()}:\n    result.append({expression.strip()})"
            additional = f", {additional_args.strip().replace(')', '')}" if additional_args else ""
            return f"{create_temp_var}\nself.play(*result{additional})"
        else:
            return f"for {var} in {iterable.strip()}:\n    {expression.strip()}"

    pattern = r'(self\.play\s*\(\s*\*?\s*)?(\w+\s*=\s*)?\[([\s\S]+?)\s+for\s+([^\s]+(?:\s*,\s*[^\s]+)?)\s+in\s+((?:[^\[\]]|\[(?:[^\[\]]|\[[^\[\]]*\])*\])*)\]((?:\s*,\s*[\s\S]+?)?\))?'
    
    return re.sub(pattern, replacement, code)

def replace_svg_mobjects(code):
    # Replace all instances of SVGMobject with Circle
    pattern = r"SVGMobject\(.*?\)"
    return re.sub(pattern, "Circle()", code)

def replace_invalid_colors(code):
    pattern = r"LIGHT_"
    return re.sub(pattern, "", code)



code2 = "planets = [Circle(radius=d, color=WHITE) for d in planet_distances]"
code3 = """rotations = [\n Rotating(planets[i], radians=2*PI, about_point=sun.get_center(), rate_func=linear, run_time=10/(i+1))\n for i in range(8)\n]"""
code4 = """self.play(\n*[Rotate(p, angle=TAU, about_point=ORIGIN, rate_func=linear, run_time=10/i) for i, p in enumerate(planets, start=1)], run_time=10)"""
code5 = """orbits = [Circle(radius=r, color=WHITE).set_stroke(opacity=0.2) for r in [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5]]"""

code6 = """
rotations = [
           Rotating(planets[i], about_point=sun.get_center(), radians=TAU, run_time=10/(i+1), rate_func=linear)
           for i in range(len(planets))
       ]
"""

code7 = """print('hello')
for i in range(8):
    planet = Circle(radius=sizes[i], fill_opacity=1, color=colors[i])
    planet.move_to(RIGHT * distances[i])
    planets.add(planet)
sizes = [0.1, 0.15, 0.2, 0.12, 0.4, 0.35, 0.3, 0.28]
distances = [1, 1.4, 1.8, 2.2, 3, 4, 5, 6]
for i in range(8):
    planet = Circle(radius=sizes[i], fill_opacity=1, color=colors[i])
    planet.move_to(RIGHT * distances[i])
    planets.add(planet)
system = VGroup(sun, planets)
system.shift(DOWN * 0.5)
for i in range(8):
    planet = Circle(radius=sizes[i], fill_opacity=1, color=colors[i])
    planet.move_to(RIGHT * distances[i])
    planets.add(planet)"""

code8 = """        self.play(Transform(cells, more_cells))
        # Forming embryo
        embryo = Ellipse(width=1.5, height=2, color=RED, fill_opacity=0.8)
        self.play(Transform(more_cells, embryo))
        # Growing fetus
        fetus = SVGMobject("baby").set_color(PINK).scale(0.5)
        self.play(Transform(embryo, fetus))
        # Final text
        final_text = Text("9 months later...", color=GREEN).scale(0.8).shift(DOWN * 3)"""

if __name__ == "__main__":
    print(replace_svg_mobjects(code8))
    quit()
    print(has_indented_statement(code7))
    extract_indented_statement(code7)
    print(replace_list_comprehensions(code2))
    print("\n")
    print(replace_list_comprehensions(code3))
    print("\n")
    print(replace_list_comprehensions(code4))
    print("\n")
    print(replace_list_comprehensions(code5))
    print("\n")
    print(replace_list_comprehensions(code6))
        


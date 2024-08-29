import re

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


if __name__ == "__main__":
    print(replace_list_comprehensions(code2))
    print("\n")
    print(replace_list_comprehensions(code3))
    print("\n")
    print(replace_list_comprehensions(code4))
    print("\n")
    print(replace_list_comprehensions(code5))
    print("\n")
    print(replace_list_comprehensions(code6))
        


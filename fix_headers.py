import os
import re

COMPONENTS_DIR = '/home/yashang/.gemini/antigravity/scratch/CollabCRM_CEO_Dashboard_Final/src/components'
EXCLUDE_DIRS = ['hero', 'layout', 'common']

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original_content = content

    # 1. Standardize all <h3 ...>Widget Name</h3>
    def h3_repl(match):
        inner_text = match.group(1).strip()
        return f'<h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">{inner_text}</h3>'
    content = re.sub(r'<h3\s+className=[^>]+>([\s\S]*?)</h3>', h3_repl, content)

    # 2. Find the container div for the h3 and InfoTooltip and ensure it has the separator line.
    # We look for a div that contains BOTH <h3 ...> and <InfoTooltip ... /> directly inside a flex.
    # Because there's a lot of variance, we can just replace the direct parent div of the h3.
    # Basically:
    # <div className="[anything]">
    #     <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">TITLE</h3>
    #     <InfoTooltip content="..." />
    # </div>
    # OR similar.

    # Regex to match the wrapping div of H3 and Tooltip and replace its classes.
    # It usually looks like <div className="flex items-center[^\"]*"> OR <div className="flex justify-between items-start mb-6 shrink-0 z-10">
    # Let's replace ANY div that immediately precedes our standardized h3.
    
    def repl_container(match):
        pre_spaces = match.group(1)
        h3_part = match.group(2)
        tooltip_part = match.group(3)
        return f'{pre_spaces}<div className="flex justify-between items-start mb-6 shrink-0 z-10 border-b border-slate-100/80 pb-4">\n{pre_spaces}    <div className="flex items-center">\n{pre_spaces}        {h3_part}\n{pre_spaces}        {tooltip_part}\n{pre_spaces}    </div>\n{pre_spaces}</div>'

    # Pattern: <div className=".*">\s*<h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">.*?</h3>\s*<InfoTooltip content=".*?"(?: />|></InfoTooltip>)\s*</div>
    # Actually, we can just replace the whole block if we find an h3 and an InfoTooltip close together.
    pattern = r'(\s*)<div className="[^"]*">\s*(<h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">[\s\S]*?</h3>)\s*(<InfoTooltip content="[^"]+"\s*(?:/>|></InfoTooltip>))\s*</div>'
    
    content = re.sub(pattern, repl_container, content)
    
    # What if the parent div doesn't wrap both cleanly? Let's also do a broader pass:
    # Look for a div that contains *another* div that contains h3 and tooltip (like what we just created), and ensure the OUTER div has the border.
    # Wait, the `repl_container` creates the perfect structure `<div class="flex justify-between..."><div class="flex items-center"><h3>...</h3><ToolTip/></div></div>`
    # Let's check for existing `flex justify-between` wrappers and replace them.
    pattern2 = r'(\s*)<div className="flex justify-between items-start mb-6 shrink-0 z-10">\s*<div className="flex items-center">\s*(<h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">[\s\S]*?</h3>)\s*(<InfoTooltip content="[^"]+"\s*(?:/>|></InfoTooltip>))\s*</div>\s*</div>'
    content = re.sub(pattern2, repl_container, content)

    if content != original_content:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Standardized header in {filepath}")

for root, dirs, files in os.walk(COMPONENTS_DIR):
    path_parts = root.split(os.sep)
    if any(ex in path_parts for ex in EXCLUDE_DIRS):
        continue
    for file in files:
        if file.endswith('.tsx') and file != 'index.tsx':
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                if 'InfoTooltip' in f.read():
                    process_file(filepath)

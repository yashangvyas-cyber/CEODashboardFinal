import os
import re

COMPONENTS_DIR = '/home/yashang/.gemini/antigravity/scratch/CollabCRM_CEO_Dashboard_Final/src/components'
EXCLUDE_DIRS = ['hero', 'layout', 'common']

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original = content

    # 1. Update <h3> classes
    # Finds <h3 className="..."> and replaces the class but keeps the text.
    def h3_repl(match):
        inner_text = match.group(1).strip()
        return f'<h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">{inner_text}</h3>'
    content = re.sub(r'<h3\s+className=[^>]+>([\s\S]*?)</h3>', h3_repl, content)

    # 2. Add border-b separator to the direct parent container
    # Most containers have "mb-6". We look for `<div className="... mb-6 ...">` that immediately precedes the newly styled `<h3>`
    # or `<div className="flex items-center mb-6">`
    # Let's just find the div that is functionally the header wrapper.
    # It usually has `flex` and `mb-6` or `mb-4`.
    
    # We can do this safely:
    # Find: <div className="([^"]*)">\s*<h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">
    def div_repl(match):
        classes = match.group(1)
        # Add border classes if not present
        if 'border-b' not in classes:
            classes = classes.replace('mb-6', 'mb-6 pb-4 border-b border-slate-100/80 w-full shrink-0')
            classes = classes.replace('mb-4', 'mb-4 pb-4 border-b border-slate-100/80 w-full shrink-0')
            # If neither mb-6 nor mb-4 was there, just append it
            if 'mb-6' not in classes and 'mb-4' not in classes:
                classes += ' mb-6 pb-4 border-b border-slate-100/80 w-full shrink-0'
            
            # Ensure it has flex justify-between if it only had flex items-center
            if 'flex items-center' in classes and 'justify-between' not in classes:
                classes = classes.replace('flex items-center', 'flex items-center justify-between')
            
        return f'<div className="{classes}">' + match.group(2)

    content = re.sub(r'<div className="([^"]*)">(\s*<h3 className="text-sm)', div_repl, content)

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, _, files in os.walk(COMPONENTS_DIR):
    if any(ex in root for ex in EXCLUDE_DIRS):
        continue
    for file in files:
        if file.endswith('.tsx') and 'SummaryCards' not in file:
            # SummaryCards have a different structure, we skip them or standardise if they have h3
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                if '<h3 ' in f.read():
                    process_file(filepath)

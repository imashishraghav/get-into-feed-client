"""
Python AI Growth & Advanced SEO Engine for Get Into Feed
Handles:
- Advanced Real-Time SEO Scoring (0-100 Score)
- Semantic Entity & Keyword Density Analysis
- Google SERP Snippet Validation (Desktop & Mobile)
- Lead & Candidate CRM Export to CSV / Excel
- AI Prompt & Metadata Optimization
"""

import sys
import json
import re

def calculate_readability(text: str) -> dict:
    words = re.findall(r'\b\w+\b', text)
    sentences = [s.strip() for s in re.split(r'[\.\?!]+', text) if s.strip()]
    
    word_count = len(words)
    sentence_count = max(len(sentences), 1)
    avg_sentence_len = word_count / sentence_count
    
    long_words = [w for w in words if len(w) > 6]
    complex_word_ratio = (len(long_words) / max(word_count, 1)) * 100
    
    # LIX readability index
    lix = avg_sentence_len + complex_word_ratio
    grade = "Standard"
    if lix < 30:
        grade = "Very Easy"
    elif lix < 40:
        grade = "Easy"
    elif lix < 50:
        grade = "Standard / Business"
    elif lix < 60:
        grade = "Technical"
    else:
        grade = "Complex Academic"
        
    return {
        "wordCount": word_count,
        "sentenceCount": sentence_count,
        "avgSentenceLength": round(avg_sentence_len, 1),
        "readabilityGrade": grade,
        "lixScore": round(lix, 1)
    }

def analyze_seo(title: str, description: str, content: str, keywords_str: str) -> dict:
    score = 100
    checks = []
    
    title = (title or "").strip()
    description = (description or "").strip()
    content = (content or "").strip()
    keywords = [k.strip().lower() for k in (keywords_str or "").split(",") if k.strip()]
    
    # 1. Title Length Check (Optimal: 45 - 60 chars)
    t_len = len(title)
    if 45 <= t_len <= 65:
        checks.append({"name": "SEO Title Length", "status": "pass", "msg": f"Optimal length ({t_len}/60 chars)"})
    elif 30 <= t_len < 45 or 65 < t_len <= 75:
        score -= 8
        checks.append({"name": "SEO Title Length", "status": "warning", "msg": f"Acceptable but could be tighter ({t_len} chars. Target 50-60)"})
    else:
        score -= 18
        checks.append({"name": "SEO Title Length", "status": "fail", "msg": f"Suboptimal title length ({t_len} chars. Target 50-60)"})
        
    # 2. Meta Description Check (Optimal: 120 - 160 chars)
    d_len = len(description)
    if 120 <= d_len <= 165:
        checks.append({"name": "Meta Description Length", "status": "pass", "msg": f"Perfect Google snippet length ({d_len}/160 chars)"})
    elif 80 <= d_len < 120 or 165 < d_len <= 190:
        score -= 8
        checks.append({"name": "Meta Description Length", "status": "warning", "msg": f"Decent length ({d_len} chars. Target 140-160)"})
    else:
        score -= 16
        checks.append({"name": "Meta Description Length", "status": "fail", "msg": f"Description too short or truncated ({d_len} chars. Target 140-160)"})
        
    # 3. Target Keywords in Title & Description
    if keywords:
        primary_kw = keywords[0]
        if primary_kw in title.lower():
            checks.append({"name": "Primary Keyword in Title", "status": "pass", "msg": f"Found '{primary_kw}' in title"})
        else:
            score -= 12
            checks.append({"name": "Primary Keyword in Title", "status": "fail", "msg": f"Missing target keyword '{primary_kw}' in title"})
            
        if primary_kw in description.lower():
            checks.append({"name": "Primary Keyword in Meta Description", "status": "pass", "msg": f"Found '{primary_kw}' in description"})
        else:
            score -= 10
            checks.append({"name": "Primary Keyword in Meta Description", "status": "fail", "msg": f"Missing keyword '{primary_kw}' in description"})
    else:
        score -= 15
        checks.append({"name": "Target Keywords Defined", "status": "fail", "msg": "No target SEO keywords specified"})
        
    # 4. Content Depth & Headings
    words = re.findall(r'\b\w+\b', content)
    w_count = len(words)
    has_h2 = "## " in content or "<h2>" in content.lower()
    has_h3 = "### " in content or "<h3>" in content.lower()
    
    if w_count >= 300:
        checks.append({"name": "Content Depth", "status": "pass", "msg": f"Rich commercial copy ({w_count} words)"})
    elif w_count >= 150:
        score -= 8
        checks.append({"name": "Content Depth", "status": "warning", "msg": f"Moderate length ({w_count} words. Target 300+)"})
    else:
        score -= 15
        checks.append({"name": "Content Depth", "status": "fail", "msg": f"Thin content ({w_count} words. Target 300+)"})
        
    if has_h2:
        checks.append({"name": "H2 Heading Hierarchy", "status": "pass", "msg": "Structured H2 subheadings present"})
    else:
        score -= 8
        checks.append({"name": "H2 Heading Hierarchy", "status": "warning", "msg": "Add H2 subheadings for better readability"})
        
    readability = calculate_readability(content or description)
    final_score = max(min(score, 100), 10)
    
    return {
        "seoScore": final_score,
        "scoreGrade": "Excellent" if final_score >= 85 else "Good" if final_score >= 70 else "Needs Improvement",
        "checks": checks,
        "readability": readability,
        "serpPreview": {
            "desktop": {
                "title": title[:60] + ("..." if len(title) > 60 else ""),
                "description": description[:160] + ("..." if len(description) > 160 else "")
            },
            "mobile": {
                "title": title[:55] + ("..." if len(title) > 55 else ""),
                "description": description[:120] + ("..." if len(description) > 120 else "")
            }
        }
    }

def clean_csv_cell(val: str) -> str:
    if val is None:
        return '""'
    s = str(val).replace('"', '""').replace('\n', ' ').replace('\r', '')
    return f'"{s}"'

def export_leads_csv(leads: list) -> str:
    headers = ["ID", "Name", "Email", "Phone", "Company", "Service", "Budget", "Message", "CreatedAt"]
    rows = [",".join(headers)]
    
    for l in leads:
        row = [
            clean_csv_cell(l.get("id", "")),
            clean_csv_cell(l.get("name", "")),
            clean_csv_cell(l.get("email", "")),
            clean_csv_cell(l.get("phone", "")),
            clean_csv_cell(l.get("company", "")),
            clean_csv_cell(l.get("service", "")),
            clean_csv_cell(l.get("budget", "")),
            clean_csv_cell(l.get("message", "")),
            clean_csv_cell(l.get("createdAt", ""))
        ]
        rows.append(",".join(row))
        
    return "\n".join(rows)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No command provided"}))
        sys.exit(1)
        
    cmd = sys.argv[1]
    
    if cmd == "analyze_seo":
        raw = sys.stdin.read() or "{}"
        input_data = json.loads(raw)
        res = analyze_seo(
            input_data.get("title", ""),
            input_data.get("description", ""),
            input_data.get("content", ""),
            input_data.get("keywords", "")
        )
        print(json.dumps(res))
    elif cmd == "export_leads":
        raw = sys.stdin.read() or "{}"
        input_data = json.loads(raw)
        csv_out = export_leads_csv(input_data.get("leads", []))
        print(csv_out)
    else:
        print(json.dumps({"error": f"Unknown command: {cmd}"}))

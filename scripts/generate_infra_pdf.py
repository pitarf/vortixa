import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_pdf():
    pdf_filename = "c:/Git/React/VORIXA/public/proposta_infraestrutura_hospedagem.pdf"
    os.makedirs(os.path.dirname(pdf_filename), exist_ok=True)
    
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    
    styles = getSampleStyleSheet()
    
    # Paleta de Cores Executiva
    primary_color = colors.HexColor("#4F46E5") # Indigo
    secondary_color = colors.HexColor("#0F172A") # Slate Dark
    accent_purple = colors.HexColor("#7C3AED") # Violet
    light_bg = colors.HexColor("#F8FAFC")
    border_color = colors.HexColor("#E2E8F0")
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=secondary_color,
        spaceAfter=2
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#64748B"),
        spaceAfter=12
    )
    
    section_title = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=primary_color,
        spaceBefore=10,
        spaceAfter=6
    )
    
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#334155"),
        spaceAfter=6
    )
    
    bullet_style = ParagraphStyle(
        'BulletText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#1E293B"),
    )
    
    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white,
        alignment=1
    )
    
    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#1E293B"),
        alignment=1
    )
    
    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#0F172A"),
        alignment=1
    )

    table_cell_discount = ParagraphStyle(
        'TableCellDiscount',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#059669"),
        alignment=1
    )

    story = []

    # Cabeçalho
    story.append(Paragraph("Proposta de Infraestrutura, Hospedagem e Escalabilidade", title_style))
    story.append(Paragraph("Comparativo técnico, custos KVM 1 vs. KVM 2 e estratégias de migração sob demanda", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=primary_color, spaceAfter=10))

    intro_text = "A aplicação poderá ser hospedada de duas formas estratégicas (<b>Opção A</b>: VPS Própria do Cliente ou <b>Opção B</b>: Infraestrutura Gerenciada do Desenvolvedor com <b>30% de desconto</b>), com flexibilidade para iniciar com dimensionamento de entrada e migrar conforme a demanda."
    story.append(Paragraph(intro_text, body_style))

    # COMPARAÇÃO TÉCNICA DE HARDWARE
    story.append(Paragraph("1. Dimensionamento Técnico de Hardware (KVM 1 vs. KVM 2)", section_title))
    
    hw_data = [
        [Paragraph("Recurso / Especificação", table_header), Paragraph("Hostinger KVM 1 (Entrada / Piloto)", table_header), Paragraph("Hostinger KVM 2 (Recomendado p/ Escala)", table_header)],
        [Paragraph("<b>Processador (vCPU)</b>", table_cell), Paragraph("1 Núcleo vCPU", table_cell), Paragraph("<b>2 Núcleos vCPU (2x mais poder)</b>", table_cell_bold)],
        [Paragraph("<b>Memória RAM</b>", table_cell), Paragraph("4 GB RAM", table_cell), Paragraph("<b>8 GB RAM (2x mais capacidade)</b>", table_cell_bold)],
        [Paragraph("<b>Armazenamento NVMe</b>", table_cell), Paragraph("50 GB NVMe", table_cell), Paragraph("<b>100 GB NVMe (2x mais espaço)</b>", table_cell_bold)],
        [Paragraph("<b>Largura de Banda</b>", table_cell), Paragraph("4 TB / mês", table_cell), Paragraph("<b>8 TB / mês</b>", table_cell_bold)],
        [Paragraph("<b>Perfil de Demanda</b>", table_cell), Paragraph("Tráfego inicial / Testes / Validação", table_cell), Paragraph("Múltiplos acessos simultâneos / Alta demanda", table_cell_discount)],
    ]
    hw_table = Table(hw_data, colWidths=[160, 190, 190])
    hw_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), secondary_color),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('PADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_bg]),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(hw_table)
    story.append(Spacer(1, 8))

    # COMPARATIVO DE PREÇOS E OPÇÕES DE HOSPEDAGEM
    story.append(Paragraph("2. Comparativo de Valores: Opção A (VPS Cliente) vs. Opção B (30% OFF Desenvolvedor)", section_title))
    
    pricing_data = [
        [Paragraph("Plano / Período", table_header), Paragraph("Opção A: Hostinger (Cliente)", table_header), Paragraph("Opção B: c/ 30% OFF (Desenvolvedor)", table_header), Paragraph("Economia Total", table_header)],
        # KVM 1
        [Paragraph("<b>KVM 1</b> (1 Mês)", table_cell), Paragraph("R$ 42,40 / mês", table_cell), Paragraph("<b>R$ 29,68 / mês</b>", table_cell_discount), Paragraph("R$ 12,72", table_cell)],
        [Paragraph("<b>KVM 1</b> (12 Meses)", table_cell), Paragraph("R$ 316,71 (R$ 26,39/mês)", table_cell), Paragraph("<b>R$ 221,70 total</b> (~R$ 18,48/mês)", table_cell_discount), Paragraph("<b>R$ 95,01</b>", table_cell_bold)],
        [Paragraph("<b>KVM 1</b> (24 Meses)", table_cell), Paragraph("R$ 575,81 (R$ 23,99/mês)", table_cell), Paragraph("<b>R$ 403,07 total</b> (~R$ 16,79/mês)", table_cell_discount), Paragraph("<b>R$ 172,74</b>", table_cell_bold)],
        # KVM 2
        [Paragraph("<b>KVM 2</b> (1 Mês)", table_cell), Paragraph("R$ 69,99 / mês", table_cell), Paragraph("<b>R$ 48,99 / mês</b>", table_cell_discount), Paragraph("R$ 21,00", table_cell)],
        [Paragraph("<b>KVM 2</b> (12 Meses)", table_cell), Paragraph("R$ 467,88 (R$ 38,99/mês)", table_cell), Paragraph("<b>R$ 327,51 total</b> (~R$ 27,29/mês)", table_cell_discount), Paragraph("<b>R$ 140,37</b>", table_cell_bold)],
        [Paragraph("<b>KVM 2</b> (24 Meses)", table_cell), Paragraph("R$ 839,76 (R$ 34,99/mês)", table_cell), Paragraph("<b>R$ 587,83 total</b> (~R$ 24,49/mês)", table_cell_discount), Paragraph("<b>R$ 251,93</b>", table_cell_bold)],
    ]
    pricing_table = Table(pricing_data, colWidths=[130, 150, 160, 100])
    pricing_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('PADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_bg]),
        ('LINEBELOW', (0,3), (-1,3), 1.5, primary_color), # Divisão entre KVM 1 e KVM 2
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(pricing_table)
    story.append(Spacer(1, 8))

    # ESTRATÉGIA DE ESCALABILIDADE & MIGRAÇÃO
    story.append(Paragraph("3. Estratégia de Escalabilidade e Transição de Ambiente", section_title))
    
    scale_box_data = [
        [Paragraph(
            "<b>• Recomendação para Alta Demanda e Escala:</b> Para projetos com tráfego elevado, múltiplos acessos simultâneos e geração contínua de mídias/webhooks, é altamente recomendado contratar um ambiente análogo ao <b>KVM 2 (2 vCPU / 8 GB RAM)</b>, garantindo fluidez e evitando sobrecarga de CPU e gargalos de memória.<br/><br/>"
            "<b>• Flexibilidade de Entrada (Comece no KVM 1 e Migre Depois):</b> Caso deseje iniciar com menor investimento operacional, o projeto pode perfeitamente começar hospedado no <b>KVM 1</b>. A aplicação foi construída de forma 100% modular (Docker Standalone + PostgreSQL), permitindo que a <b>migração para o KVM 2 seja realizada a qualquer momento de forma rápida e sem perda de dados</b>.<br/><br/>"
            "<b>• Ponto de Atenção:</b> O ambiente <b>KVM 1</b> é ideal para fase inicial e validação. Caso ocorra um pico repentino de alta demanda ou rajada de usuários simultâneos, o KVM 1 poderá atingir o limite de hardware (1 vCPU), tornando a transição para o KVM 2 necessária para manter a estabilidade do sistema.",
            ParagraphStyle('ScaleText', parent=styles['Normal'], fontName='Helvetica', fontSize=8, leading=11.5, textColor=colors.HexColor("#1E293B"))
        )]
    ]
    scale_box = Table(scale_box_data, colWidths=[540])
    scale_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FEF3C7")), # Amber tint
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#F59E0B")),
        ('PADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(scale_box)
    story.append(Spacer(1, 6))

    # INFORMAÇÕES DE GESTÃO (OPÇÃO A vs OPÇÃO B)
    info_box_data = [
        [Paragraph(
            "<b>Opção A (VPS Própria do Cliente):</b> A contratação, pagamento e renovações periódicas da VPS ficam sob responsabilidade direta do cliente junto ao provedor.<br/>"
            "<b>Opção B (Infraestrutura do Desenvolvedor com 30% OFF):</b> Inclui alocação de espaço em infraestrutura dedicada gerenciada e manutenção técnica preventiva básica do ambiente para manter a aplicação online com alta disponibilidade.",
            ParagraphStyle('InfoText', parent=styles['Normal'], fontName='Helvetica', fontSize=7.5, leading=10.5, textColor=colors.HexColor("#475569"))
        )]
    ]
    info_box = Table(info_box_data, colWidths=[540])
    info_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), light_bg),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(info_box)

    doc.build(story)
    print("PDF KVM 1 vs KVM 2 gerado com sucesso em:", pdf_filename)

if __name__ == "__main__":
    generate_pdf()

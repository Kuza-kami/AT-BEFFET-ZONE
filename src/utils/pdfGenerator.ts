import { jsPDF } from "jspdf";
import { Dish } from "../types";

export function generateMenuPDF(menuItems: Dish[]) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  let currentPage = 1;
  const pageHeight = 297;
  const pageWidth = 210;
  const margin = 12;
  const contentWidth = pageWidth - (margin * 2); // 186mm

  let y = 15;

  const drawPageBorderAndFooter = () => {
    // Outer border (Brutalist style matching "At Buffet Zone")
    doc.setDrawColor(17, 17, 17);
    doc.setLineWidth(1.2);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

    // Double frame line
    doc.setLineWidth(0.4);
    doc.rect(9.5, 9.5, pageWidth - 19, pageHeight - 19);

    // Footer contact info
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    
    const footerText = "Shop 1, 28 WF Nkomo Street, Pretoria Central | Phone: +27 82 884 3574 | Open Mon-Sun";
    doc.text(footerText, pageWidth / 2, pageHeight - 12, { align: "center" });
    
    const pageNumText = `Page ${currentPage}`;
    doc.text(pageNumText, pageWidth - 15, pageHeight - 12, { align: "right" });
  };

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 20) {
      doc.addPage();
      currentPage++;
      y = 15;
      drawPageBorderAndFooter();
      drawPageHeaderCompact();
    }
  };

  const drawPageHeaderCompact = () => {
    // Compact header for subsequent pages
    doc.setFillColor(255, 189, 18); // Gold
    doc.rect(margin, y, contentWidth, 12, "F");
    doc.setDrawColor(17, 17, 17);
    doc.setLineWidth(0.8);
    doc.rect(margin, y, contentWidth, 12, "D");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(17, 17, 17);
    doc.text("AT BUFFET ZONE  |  OUR FULL TRADITIONAL MENU", pageWidth / 2, y + 7.5, { align: "center" });
    y += 18;
  };

  // --- PAGE 1 ---
  drawPageBorderAndFooter();

  // Header Box
  doc.setFillColor(255, 189, 18); // Gold
  doc.rect(margin, y, contentWidth, 32, "F");
  doc.setDrawColor(17, 17, 17);
  doc.setLineWidth(1.2);
  doc.rect(margin, y, contentWidth, 32, "D");

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(17, 17, 17);
  doc.text("AT BUFFET ZONE", pageWidth / 2, y + 12, { align: "center" });

  // Subtitle
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(230, 36, 25); // Red
  doc.text("AUTHENTIC TRADITIONAL AFRICAN BUFFET & TAKEAWAY", pageWidth / 2, y + 19, { align: "center" });

  // Contact details
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(17, 17, 17);
  doc.text("Pretoria Central CBD  •  +27 82 884 3574  •  Daily 07:00 - 22:30", pageWidth / 2, y + 26, { align: "center" });

  y += 38;

  // Pricing Board
  doc.setFillColor(250, 246, 238); // Cream
  doc.rect(margin, y, contentWidth, 22, "F");
  doc.setDrawColor(17, 17, 17);
  doc.setLineWidth(0.8);
  doc.rect(margin, y, contentWidth, 22, "D");

  // Ribbon Header
  doc.setFillColor(230, 36, 25); // Red
  doc.rect(margin + 6, y - 3, 42, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text("DAILY BUFFET SPECIALS", margin + 27, y + 1.2, { align: "center" });

  // Prices
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(17, 17, 17);
  doc.text("All-You-Can-Eat Lunch Buffet: R135", margin + 8, y + 9);
  doc.text("Breakfast Buffet: R75", margin + 8, y + 16);

  // Description highlights
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text("Includes starch, 2 meats, 3 sides & traditional gravies.", margin + 105, y + 9);
  doc.text("Served warm with daily steam-bread, porridge, eggs & wors.", margin + 105, y + 16);

  y += 30;

  // Organize by Categories
  const categories: { key: string; label: string; desc?: string }[] = [
    { key: "traditional", label: "SIGNATURE SPECIALTIES", desc: "Patiently slow-simmered South African local delicacies and fresh takeaways." },
    { key: "breakfast", label: "BREAKFAST BUFFET SELECTION", desc: "Warm sorghum porridge, eggs, wors, and fresh bakes served daily from 07:00." },
    { key: "lunch_meats", label: "BUFFET MEATS", desc: "Prepared fresh everyday for our R135 all-you-can-eat feast." },
    { key: "lunch_veggies", label: "VEGGIES & SIDES", desc: "Traditional slow-cooked accompaniments and rich home-style gravies." },
    { key: "dessert", label: "DESSERTS", desc: "Sweet, traditional baked and chilled favorites." },
    { key: "beverage", label: "TRADITIONAL DRINKS", desc: "Ice-cold house brewed beverages and herbal refreshments." }
  ];

  categories.forEach((cat) => {
    const items = menuItems.filter(item => item.category === cat.key);
    if (items.length === 0) return;

    // Check height for category title
    checkPageBreak(25);

    // Draw Category Title
    doc.setFillColor(17, 17, 17);
    doc.rect(margin, y, contentWidth, 8, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(cat.label, margin + 4, y + 5.5);

    y += 12;

    // Draw category description
    if (cat.desc) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 100, 100);
      doc.text(cat.desc, margin, y);
      y += 5;
    }

    // Draw items
    items.forEach((item) => {
      const nameText = item.xhosaName ? `${item.name} (${item.xhosaName})` : item.name;
      const priceText = item.price ? `R${item.price}` : "Buffet Included";

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      const titleWidth = doc.getTextWidth(nameText);
      const priceWidth = doc.getTextWidth(priceText);

      // Split description
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      const descriptionLines = doc.splitTextToSize(item.description, contentWidth - 10);
      const neededHeight = 5 + (descriptionLines.length * 3.8) + 6; // spacing

      checkPageBreak(neededHeight);

      // Draw Item Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(17, 17, 17);
      doc.text(nameText, margin + 2, y);

      // Draw price right-aligned
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(230, 36, 25); // Red price
      doc.text(priceText, pageWidth - margin - 2, y, { align: "right" });

      // Draw thin dotted line connecting item name to price
      doc.setDrawColor(190, 190, 190);
      doc.setLineWidth(0.2);
      const lineStart = margin + titleWidth + 6;
      const lineEnd = pageWidth - margin - priceWidth - 6;
      if (lineEnd > lineStart) {
        let currentX = lineStart;
        while (currentX < lineEnd) {
          doc.line(currentX, y - 1, currentX + 0.8, y - 1);
          currentX += 2.2;
        }
      }

      y += 4.5;

      // Draw Description
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(80, 80, 80);
      descriptionLines.forEach((line: string) => {
        doc.text(line, margin + 2, y);
        y += 3.8;
      });

      y += 3.5; // spacing between items
    });

    y += 5; // spacing between categories
  });

  // Save the PDF
  doc.save("At_Buffet_Zone_Menu.pdf");
}

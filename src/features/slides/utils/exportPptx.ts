import PptxGenJS from 'pptxgenjs';
import { Deck } from '../types';

export const exportPptx = async (deck: Deck) => {
    const pres = new PptxGenJS();
    pres.layout = 'LAYOUT_16x9'; // 10 x 5.625 inches

    // Elice Theme Colors
    const C = {
        PRIMARY: '6700e6',
        PRIMARY_LIGHT: 'd6c0ff',
        PRIMARY_LIGHTER: 'e9dfff',
        PRIMARY_LIGHTEST: 'f4efff',
        SLATE_900: '0f172a',
        SLATE_800: '1e2936',
        SLATE_700: '334152',
        SLATE_600: '475569',
        SLATE_500: '64748b',
        SLATE_400: '94a3b8',
        SLATE_200: 'e2e8f0',
        SLATE_100: 'f1f5f9',
        SLATE_50: 'f8fafc',
        WHITE: 'FFFFFF',
        EMERALD_500: '22c55e',
        EMERALD_100: 'dcfce7',
        EMERALD_700: '15803d',
        INDIGO_100: 'e0e7ff',
        PURPLE_100: 'f3e8ff',
    };

    // Helper for determining layout
    const getLayoutType = (suggestion: string, sectionId: string): string => {
        if (sectionId === 'quiz') return 'quiz';
        if (sectionId === 'exercises') return 'exercise';
        const s = suggestion?.toLowerCase() || '';
        if (s.includes('title only') || s.includes('title slide')) return 'title';
        if (s.includes('center') || s.includes('thank you') || s.includes('end')) return 'center';
        if (s.includes('image right') || s.includes('image-right')) return 'image-right';
        if (s.includes('sidebar')) return 'sidebar';
        if (s.includes('two column') || s.includes('split')) return 'split';
        return 'standard';
    };

    deck.slides.forEach((slide, index) => {
        const pptxSlide = pres.addSlide();
        const layout = getLayoutType(slide.layoutSuggestion, slide.sectionId);

        // Notes
        if (slide.speakerNotes) pptxSlide.addNotes(slide.speakerNotes);

        // Page Number (Except Title/Center)
        if (layout !== 'title' && layout !== 'center') {
            pptxSlide.addText(`${index + 1} / ${deck.slides.length}`, {
                x: '90%', y: '92%', w: '8%', h: 0.3,
                fontSize: 10, color: C.SLATE_400, align: 'right'
            });
        }

        // --- Layout Implementations ---

        if (layout === 'title') {
            pptxSlide.background = { color: C.WHITE };
            
            // Top Gradient Bar
            pptxSlide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.15, fill: { color: C.PRIMARY } });
            
            // Abstract Blobs (Approximation)
            pptxSlide.addShape(pres.ShapeType.ellipse, { x: 1.5, y: 1.5, w: 2.5, h: 2.5, fill: { color: C.PRIMARY_LIGHTEST } });
            pptxSlide.addShape(pres.ShapeType.ellipse, { x: 7, y: 3.5, w: 2, h: 2, fill: { color: C.PURPLE_100 } });

            // Title
            pptxSlide.addText(slide.title, {
                x: 1, y: 1.8, w: 8, h: 2,
                fontSize: 44, bold: true, color: C.SLATE_900, align: 'center', fontFace: 'Arial'
            });

            // Subtitle / First Bullet
            if (slide.bullets.length > 0) {
                // Decorator Line
                pptxSlide.addShape(pres.ShapeType.rect, { x: 4.5, y: 3.8, w: 1, h: 0.05, fill: { color: C.PRIMARY } });
                pptxSlide.addText(slide.bullets[0], {
                    x: 1.5, y: 4.0, w: 7, h: 1,
                    fontSize: 18, color: C.SLATE_500, align: 'center', fontFace: 'Arial'
                });
            }

        } else if (layout === 'center') {
            pptxSlide.background = { color: C.SLATE_900 };
            
            // Decorative Accent
            pptxSlide.addShape(pres.ShapeType.rect, { x: 8.5, y: 0, w: 1.5, h: '100%', fill: { color: C.PRIMARY, transparency: 85 } });

            pptxSlide.addText(slide.title, {
                x: 1, y: 2, w: 8, h: 1.5,
                fontSize: 36, bold: true, color: C.WHITE, align: 'center', fontFace: 'Arial'
            });

            if (slide.bullets.length > 0) {
                pptxSlide.addText(slide.bullets.join('\n'), {
                    x: 2, y: 3.5, w: 6, h: 1.5,
                    fontSize: 14, color: C.SLATE_400, align: 'center', fontFace: 'Arial'
                });
            }

        } else if (layout === 'quiz') {
            pptxSlide.background = { color: C.SLATE_50 };

            // Corner Blobs
            pptxSlide.addShape(pres.ShapeType.ellipse, { x: 8.5, y: -1, w: 3, h: 3, fill: { color: C.INDIGO_100 } });
            pptxSlide.addShape(pres.ShapeType.ellipse, { x: -1, y: 4.5, w: 3, h: 3, fill: { color: C.PURPLE_100 } });

            // Badge
            pptxSlide.addShape(pres.ShapeType.roundRect, { x: 8.2, y: 0.3, w: 1.5, h: 0.4, fill: { color: C.PRIMARY_LIGHTEST }, r: 0.2 });
            pptxSlide.addText('QUIZ QUESTION', { x: 8.2, y: 0.3, w: 1.5, h: 0.4, fontSize: 10, color: C.PRIMARY, bold: true, align: 'center' });

            // Question
            pptxSlide.addText(slide.title, {
                x: 1, y: 1, w: 8, h: 1.2,
                fontSize: 24, bold: true, color: C.SLATE_800, align: 'center', fontFace: 'Arial'
            });

            // Options
            const opts = slide.bullets;
            const isGrid = opts.length > 2;
            opts.forEach((opt, idx) => {
                const row = isGrid ? Math.floor(idx / 2) : idx;
                const col = isGrid ? idx % 2 : 0;
                
                const w = isGrid ? 3.8 : 6;
                const h = 0.8;
                const x = isGrid ? (col === 0 ? 1 : 5.2) : 2;
                const y = 2.5 + (row * 1.0);

                // Option Box
                pptxSlide.addShape(pres.ShapeType.roundRect, {
                    x: x, y: y, w: w, h: h,
                    fill: { color: C.WHITE }, line: { color: C.SLATE_200, width: 1.5 }, r: 0.1
                });

                // Letter Circle
                pptxSlide.addShape(pres.ShapeType.ellipse, {
                    x: x + 0.15, y: y + 0.15, w: 0.5, h: 0.5,
                    fill: { color: C.SLATE_100 }, line: { color: C.SLATE_200, width: 1 }
                });
                pptxSlide.addText(String.fromCharCode(65 + idx), {
                    x: x + 0.15, y: y + 0.15, w: 0.5, h: 0.5,
                    fontSize: 14, bold: true, color: C.SLATE_600, align: 'center'
                });

                // Option Text
                pptxSlide.addText(opt, {
                    x: x + 0.8, y: y + 0.1, w: w - 1, h: h - 0.2,
                    fontSize: 12, color: C.SLATE_700, align: 'left', valign: 'middle'
                });
            });

        } else if (layout === 'exercise') {
            pptxSlide.background = { color: C.SLATE_50 };

            // Blobs
            pptxSlide.addShape(pres.ShapeType.ellipse, { x: 8.5, y: -1, w: 3, h: 3, fill: { color: C.EMERALD_100 } });
            pptxSlide.addShape(pres.ShapeType.ellipse, { x: -1, y: 4.5, w: 3, h: 3, fill: { color: 'ccfbf1' } }); // teal-100

            // Badge
            pptxSlide.addShape(pres.ShapeType.roundRect, { x: 7.5, y: 0.3, w: 2.2, h: 0.4, fill: { color: C.EMERALD_100 }, r: 0.2 });
            pptxSlide.addText('PRACTICAL EXERCISE', { x: 7.5, y: 0.3, w: 2.2, h: 0.4, fontSize: 10, color: C.EMERALD_700, bold: true, align: 'center' });

            // Title with Border
            pptxSlide.addShape(pres.ShapeType.rect, { x: 1, y: 1, w: 0.08, h: 0.5, fill: { color: C.EMERALD_500 } });
            pptxSlide.addText(slide.title, {
                x: 1.2, y: 0.9, w: 7, h: 0.7,
                fontSize: 28, bold: true, color: C.SLATE_800, align: 'left'
            });

            // Card
            pptxSlide.addShape(pres.ShapeType.roundRect, {
                x: 1, y: 1.8, w: 8, h: 3.2,
                fill: { color: C.WHITE }, line: { color: C.SLATE_200, width: 1 }, r: 0.1,
                shadow: { type: 'outer', color: '000000', opacity: 0.05, blur: 3, offset: 2 }
            });

            // Content
            pptxSlide.addText(slide.bullets.map(b => b).join('\n\n'), {
                x: 1.4, y: 2.0, w: 7.2, h: 2.8,
                fontSize: 14, color: C.SLATE_600,
                bullet: { type: 'bullet', code: '2022', color: C.EMERALD_500 },
                lineSpacing: 24, valign: 'top'
            });

        } else if (layout === 'sidebar') {
            pptxSlide.background = { color: C.WHITE };
            
            // Sidebar
            pptxSlide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '33%', h: '100%', fill: { color: C.PRIMARY_LIGHTEST } });
            pptxSlide.addShape(pres.ShapeType.line, { x: 3.33, y: 0, w: 0, h: '100%', line: { color: C.SLATE_100, width: 1 } });

            // Sidebar Title
            pptxSlide.addText(slide.title, {
                x: 0.4, y: 1.5, w: 2.5, h: 2.5,
                fontSize: 28, bold: true, color: C.SLATE_900, align: 'left', valign: 'middle'
            });
            // Sidebar Line
            pptxSlide.addShape(pres.ShapeType.rect, { x: 0.4, y: 3.8, w: 0.5, h: 0.05, fill: { color: C.PRIMARY } });

            // Main Content
            if (slide.bullets.length > 0) {
                pptxSlide.addText(slide.bullets.map(b => b).join('\n'), {
                    x: 3.8, y: 1, w: 5.8, h: 4,
                    fontSize: 16, color: C.SLATE_600,
                    bullet: { type: 'bullet', code: '2022', color: C.PRIMARY },
                    lineSpacing: 28, valign: 'middle'
                });
            }

        } else if (layout === 'split') {
            pptxSlide.background = { color: C.WHITE };
            
            // Top Right Decoration
            pptxSlide.addShape(pres.ShapeType.ellipse, { x: 9, y: -1, w: 3, h: 3, fill: { color: C.PRIMARY_LIGHTEST } });

            // Title
            pptxSlide.addText(slide.title, {
                x: 0.5, y: 0.5, w: 8, h: 0.8,
                fontSize: 28, bold: true, color: C.SLATE_800, align: 'left'
            });
            pptxSlide.addShape(pres.ShapeType.line, { x: 0.5, y: 1.2, w: 1, h: 0, line: { color: C.PRIMARY, width: 2 } });

            const mid = Math.ceil(slide.bullets.length / 2);
            const col1 = slide.bullets.slice(0, mid);
            const col2 = slide.bullets.slice(mid);

            pptxSlide.addText(col1.map(b => b).join('\n'), {
                x: 0.5, y: 1.6, w: 4.2, h: 3.5,
                fontSize: 14, color: C.SLATE_600,
                bullet: { type: 'bullet', code: '2022', color: C.PRIMARY },
                lineSpacing: 24, valign: 'top'
            });

            if (col2.length > 0) {
                pptxSlide.addText(col2.map(b => b).join('\n'), {
                    x: 5.0, y: 1.6, w: 4.2, h: 3.5,
                    fontSize: 14, color: C.SLATE_600,
                    bullet: { type: 'bullet', code: '2022', color: C.PRIMARY },
                    lineSpacing: 24, valign: 'top'
                });
            }

        } else if (layout === 'image-right') {
            pptxSlide.background = { color: C.WHITE };
            // Top Line
            pptxSlide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.1, fill: { color: C.PRIMARY } });

            pptxSlide.addText(slide.title, {
                x: 0.5, y: 0.5, w: 9, h: 0.8,
                fontSize: 28, bold: true, color: C.SLATE_800
            });

            // Bullets Left
            pptxSlide.addText(slide.bullets.map(b => b).join('\n'), {
                x: 0.5, y: 1.5, w: 4.5, h: 3.5,
                fontSize: 16, color: C.SLATE_600,
                bullet: { type: 'bullet', code: '2022', color: C.PRIMARY },
                lineSpacing: 24, valign: 'top'
            });

            // Image Placeholder Right
            pptxSlide.addShape(pres.ShapeType.rect, {
                x: 5.5, y: 1.5, w: 4, h: 3,
                fill: { color: C.SLATE_50 }, line: { color: C.SLATE_200, width: 1, dashType: 'dash' }
            });
            pptxSlide.addText('Image Placeholder', {
                x: 5.5, y: 1.5, w: 4, h: 3,
                fontSize: 14, color: C.SLATE_400, align: 'center'
            });

        } else {
            // Standard
            pptxSlide.background = { color: C.WHITE };
            // Top Line
            pptxSlide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.1, fill: { color: C.PRIMARY } });
            
            // Corner Decoration
            pptxSlide.addShape(pres.ShapeType.ellipse, { x: 8.5, y: 4.5, w: 2, h: 2, fill: { color: C.SLATE_50 } });

            pptxSlide.addText(slide.title, {
                x: 0.5, y: 0.6, w: 9, h: 0.8,
                fontSize: 30, bold: true, color: C.SLATE_800
            });

            pptxSlide.addText(slide.bullets.map(b => b).join('\n'), {
                x: 0.5, y: 1.6, w: 9, h: 3.5,
                fontSize: 16, color: C.SLATE_600,
                bullet: { type: 'bullet', code: '2022', color: C.PRIMARY },
                lineSpacing: 28, valign: 'top'
            });
        }
    });

    const safeTitle = deck.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    await pres.writeFile({ fileName: `${safeTitle}.pptx` });
};
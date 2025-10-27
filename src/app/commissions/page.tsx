import Image from 'next/image';
import { CheckCircle, FileText, Pencil, Palette } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPlaceholderImage } from '@/lib/utils';
import CommissionForm from './commission-form';

const pricingTiers = [
  {
    title: "Digital Portrait",
    price: "$150",
    features: ["Head and shoulders", "Simple background", "High-resolution digital file"],
    imageId: "commission-digital",
    imageHint: "digital portrait",
  },
  {
    title: "Watercolor Piece",
    price: "$250",
    features: ["Up to full body", "Stylized background", "Physical piece + digital scan"],
    imageId: "commission-watercolor",
    imageHint: "watercolor portrait",
  },
  {
    title: "Full Illustration",
    price: "$400+",
    features: ["Complex scene", "Multiple characters", "Full commercial rights available"],
    imageId: "commission-illustration",
    imageHint: "fantasy illustration",
  },
  {
    title: "Custom Inking",
    price: "$200",
    features: ["Detailed line art", "Monochromatic style", "Perfect for tattoos or prints"],
    imageId: "commission-inking",
    imageHint: "ink illustration",
  },
];

const processSteps = [
  { icon: FileText, title: "Inquiry", description: "You fill out the form with your idea." },
  { icon: Pencil, title: "Sketch Approval", description: "I create a sketch for your review." },
  { icon: Palette, title: "Final Art", description: "I complete the artwork with colors and details." },
  { icon: CheckCircle, title: "Delivery", description: "You receive the final high-quality files." },
];

export default function CommissionsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-16">
        <Badge className="text-lg bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30 mb-4">
          Slots Open
        </Badge>
        <h1 className="font-headline text-6xl md:text-7xl tracking-wider text-primary">
          Bring Your Vision to Life
        </h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-3xl mx-auto">
          Interested in a custom piece of art? I'd love to collaborate with you.
          Here's how you can commission a unique artwork from me.
        </p>
      </div>

      <section className="mb-16">
        <h2 className="font-headline text-center text-5xl tracking-wider mb-12">Pricing Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pricingTiers.map(tier => {
            const image = getPlaceholderImage(tier.imageId);
            return (
              <Card key={tier.title} className="flex flex-col">
                <CardHeader>
                  {image && (
                    <div className="relative h-48 w-full mb-4 rounded-md overflow-hidden">
                      <Image
                        src={image.imageUrl}
                        alt={`Example of ${tier.title}`}
                        fill
                        className="object-cover"
                        data-ai-hint={tier.imageHint}
                      />
                    </div>
                  )}
                  <CardTitle className="font-headline text-3xl tracking-wide">{tier.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <div>
                    <p className="text-4xl font-bold text-primary mb-4">{tier.price}</p>
                    <ul className="space-y-2 text-muted-foreground">
                      {tier.features.map(feature => (
                        <li key={feature} className="flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4 text-primary/70" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
           <h2 className="font-headline text-5xl tracking-wider mb-8">Request a Commission</h2>
          <CommissionForm />
        </div>
        <div className="space-y-12">
          <div>
            <h2 className="font-headline text-3xl tracking-wider mb-6">The Process</h2>
            <div className="relative space-y-8">
              {processSteps.map((step, index) => (
                <div key={step.title} className="flex items-start gap-4">
                  <div className="flex-shrink-0 bg-card p-3 rounded-full border">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-headline text-3xl tracking-wider mb-6">Terms & Conditions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Revisions</AccordionTrigger>
                <AccordionContent>
                  Two rounds of minor revisions are included during the sketch phase. Major changes or revisions after approval will incur additional costs.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Payment</AccordionTrigger>
                <AccordionContent>
                  A 50% non-refundable deposit is required to start. The remaining 50% is due upon completion, before delivery of the final files.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Usage Rights</AccordionTrigger>
                <AccordionContent>
                  All commissions are for personal use only unless commercial rights are purchased. I retain the right to display the artwork in my portfolio.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}

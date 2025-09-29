import { Testimonial } from '../../types/testimonial';

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg bg-white dark:bg-gray-800">
      <p>{testimonial.content}</p>
      <p>Rating: {testimonial.rating} / 5</p>
    </div>
  );
}

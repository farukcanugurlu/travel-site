// Şimdilik mock: gerçek storage'a geçtiğimizde burada Supabase upload yapacağız
export async function uploadTourImage(_file: File): Promise<string> {
  void _file; // lint sustur
  return "/assets/img/listing/listing-1.jpg";
}

// GET and POST API for products
import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('products').select('*');
    if (error) return res.status(500).json({ error });
    return res.status(200).json({ data });
  }

  if (req.method === 'POST') {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated1' });
    }

    let user;
    try {
      const { data: userData, error: authError } = await supabase.auth.getUser(token);
      user = userData?.user;
      if (authError || !user) {
        return res.status(401).json({ error: 'Not authenticated2' });
      }
    } catch (err) {
      return res.status(401).json({ error: 'Not authenticated3' });
    }

    const { name, description, price, image } = req.body;

    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: name || null,
          description: description || null,
          price: price || 0,
          image: image || null,
          userId: user.id,
        }])
        .select();

      if (error) {
        throw new Error(error.message);
      }

      return res.status(201).json(data[0]);
    } catch (err) {
      return res.status(500).json({ error });
    }
  }

  return res.status(405).end();
}
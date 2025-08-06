
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export const useAdminAuth = () => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if admin is already logged in (from localStorage)
    const storedAdmin = localStorage.getItem('admin_user');
    if (storedAdmin) {
      try {
        setAdminUser(JSON.parse(storedAdmin));
      } catch (error) {
        localStorage.removeItem('admin_user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // For demo purposes, we'll create a simple authentication
      // In production, you'd want proper password hashing with bcrypt
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !data) {
        toast({
          title: 'Login Failed',
          description: 'Invalid email or password',
          variant: 'destructive'
        });
        return false;
      }

      // Simple password check (in production, use proper hashing)
      if (data.password_hash !== password) {
        toast({
          title: 'Login Failed',
          description: 'Invalid email or password',
          variant: 'destructive'
        });
        return false;
      }

      const admin = {
        id: data.id,
        email: data.email,
        name: data.name
      };

      setAdminUser(admin);
      localStorage.setItem('admin_user', JSON.stringify(admin));
      
      toast({
        title: 'Success',
        description: 'Admin login successful',
      });
      
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred during login',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem('admin_user');
    toast({
      title: 'Logged Out',
      description: 'Admin session ended',
    });
  };

  const createInitialAdmin = async () => {
    try {
      // Create a default admin user for demo purposes
      const { error } = await supabase
        .from('admin_users')
        .insert([{
          email: 'admin@spicebazaar.com',
          password_hash: 'admin123', // In production, hash this properly
          name: 'Admin User'
        }]);

      if (!error) {
        toast({
          title: 'Default Admin Created',
          description: 'Email: admin@spicebazaar.com, Password: admin123',
        });
      }
    } catch (error) {
      console.error('Error creating admin:', error);
    }
  };

  return {
    adminUser,
    loading,
    login,
    logout,
    createInitialAdmin,
    isAdmin: !!adminUser
  };
};

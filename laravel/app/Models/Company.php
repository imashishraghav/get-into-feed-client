<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $table = 'crm_companies';

    protected $fillable = [
        'name',
        'industry',
        'website',
        'phone',
        'email',
        'address',
    ];

    public function contacts()
    {
        return $this->hasMany(Contact::class, 'company_id');
    }

    public function opportunities()
    {
        return $this->hasMany(Opportunity::class, 'company_id');
    }
}

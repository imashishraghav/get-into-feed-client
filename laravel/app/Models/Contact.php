<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $table = 'crm_contacts';

    protected $fillable = [
        'company_id',
        'name',
        'email',
        'phone',
        'job_title',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }
}
